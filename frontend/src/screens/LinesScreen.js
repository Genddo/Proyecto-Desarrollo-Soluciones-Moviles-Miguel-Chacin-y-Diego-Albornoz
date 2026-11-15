import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import api from '../services/api';
import { COLORS } from '../theme/colors';

export default function LinesScreen({ navigation }) {
  const [lines, setLines] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLines();
  }, []);

  const loadLines = async (term = '') => {
    try {
      setError('');

      const params = {};

      if (term.trim()) {
        params.q = term.trim();
      }

      const response = await api.get('/red/lines', {
        params,
      });

      const result =
        response.data?.data ?? response.data;

      const list = Array.isArray(result)
        ? result
        : result?.lines ?? [];

      setLines(list);
    } catch (err) {
      setLines([]);
      setError(
        'No se pudieron cargar las líneas. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    loadLines(search);
  };

  const handleClear = () => {
    setSearch('');
    setLoading(true);
    loadLines('');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadLines(search);
  };

  const renderLine = ({ item }) => {
    const codigo =
      item.codigo ?? item.codigo_linea ?? '';

    const nombre =
      item.nombre ?? item.nombre_linea ?? 'Línea';

    const estado =
      item.estado ?? 'activo';

    const recorridos =
      item.recorridos ?? [];

    const suspendida =
      estado.toLowerCase() === 'suspendido' ||
      estado.toLowerCase() === 'suspendida';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.colorIndicator,
              {
                backgroundColor:
                  item.color || COLORS.primary,
              },
            ]}
          />

          <View style={styles.lineInfo}>
            <Text style={styles.code}>
              {codigo}
            </Text>

            <Text style={styles.name}>
              {nombre}
            </Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>
            Estado:
          </Text>

          <Text
            style={[
              styles.statusValue,
              suspendida && styles.suspendedText,
            ]}
          >
            {estado}
          </Text>
        </View>

        {suspendida && (
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              ⚠ Servicio temporalmente suspendido
            </Text>
          </View>
        )}

        <Text style={styles.routesText}>
          Recorridos disponibles: {recorridos.length}
        </Text>

        <TouchableOpacity
          style={styles.detailButton}
          onPress={() =>
            navigation.navigate('LineDetail', {
              idLinea: item.id_linea,
              codigo,
              nombre,
            })
          }
        >
          <Text style={styles.detailButtonText}>
            Ver recorridos
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Líneas y recorridos
      </Text>

      <Text style={styles.subtitle}>
        Consulta las líneas disponibles de VoyBus.
      </Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por código o nombre"
          placeholderTextColor="#6B7280"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>
            Buscar
          </Text>
        </TouchableOpacity>
      </View>

      {search.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
        >
          <Text style={styles.clearButtonText}>
            Limpiar búsqueda
          </Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={COLORS.text}
          />

          <Text style={styles.loadingText}>
            Cargando líneas...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              loadLines(search);
            }}
          >
            <Text style={styles.retryButtonText}>
              Reintentar
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={lines}
          keyExtractor={(item) =>
            String(item.id_linea)
          }
          renderItem={renderLine}
          contentContainerStyle={
            lines.length === 0
              ? styles.emptyList
              : styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyTitle}>
                No encontramos líneas
              </Text>

              <Text style={styles.emptyText}>
                Prueba con otro código o nombre.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 20,
  },

  searchContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  searchInput: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.background,
    color: COLORS.text,
    fontSize: 15,
    marginRight: 8,
  },

  searchButton: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.text,
  },

  searchButtonText: {
    fontWeight: 'bold',
    color: COLORS.text,
  },

  clearButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 6,
  },

  clearButtonText: {
    color: COLORS.text,
    textDecorationLine: 'underline',
  },

  list: {
    paddingBottom: 30,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  colorIndicator: {
    width: 12,
    height: 52,
    borderRadius: 6,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  lineInfo: {
    flex: 1,
  },

  code: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },

  name: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  statusRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  statusLabel: {
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 6,
  },

  statusValue: {
    color: COLORS.text,
    textTransform: 'capitalize',
  },

  suspendedText: {
    fontWeight: 'bold',
  },

  warning: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  warningText: {
    color: COLORS.text,
    fontWeight: '600',
  },

  routesText: {
    color: COLORS.text,
    marginBottom: 14,
  },

  detailButton: {
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.text,
  },

  detailButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 15,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    color: COLORS.text,
  },

  errorText: {
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 16,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },

  emptyText: {
    textAlign: 'center',
    color: COLORS.text,
  },
});