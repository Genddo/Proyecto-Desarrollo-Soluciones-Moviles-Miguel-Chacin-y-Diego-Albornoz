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

export default function StopsScreen({ navigation }) {
  const [stops, setStops] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStops();
  }, []);

  const loadStops = async (term = '') => {
    try {
      setError('');

      const params = {};

      if (term.trim()) {
        params.q = term.trim();
      }

      const response = await api.get('/red/stops', {
        params,
      });

      const result =
        response.data?.data ?? response.data;

      const list = Array.isArray(result)
        ? result
        : result?.stops ?? [];

      setStops(list);
    } catch (err) {
      setStops([]);
      setError(
        'No se pudieron cargar los paraderos. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    loadStops(search);
  };

  const handleClear = () => {
    setSearch('');
    setLoading(true);
    loadStops('');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadStops(search);
  };

  const renderStop = ({ item }) => {
    const codigo =
      item.codigo ?? item.codigo_paradero ?? '';

    const nombre =
      item.nombre ?? item.nombre_paradero ?? 'Paradero';

    return (
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>P</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.code}>
            {codigo}
          </Text>

          <Text style={styles.name}>
            {nombre}
          </Text>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() =>
              navigation.navigate('StopDetail', {
                idParadero: item.id_paradero,
                codigo,
                nombre,
              })
            }
          >
            <Text style={styles.detailButtonText}>
              Ver detalle
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Paraderos
      </Text>

      <Text style={styles.subtitle}>
        Consulta los paraderos disponibles en la red VoyBus.
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
            Cargando paraderos...
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
              loadStops(search);
            }}
          >
            <Text style={styles.retryButtonText}>
              Reintentar
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={stops}
          keyExtractor={(item) =>
            String(item.id_paradero)
          }
          renderItem={renderStop}
          contentContainerStyle={
            stops.length === 0
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
                No encontramos paraderos
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
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: COLORS.text,
  },

  iconText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 20,
  },

  info: {
    flex: 1,
  },

  code: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 3,
  },

  name: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },

  detailButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.text,
  },

  detailButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
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