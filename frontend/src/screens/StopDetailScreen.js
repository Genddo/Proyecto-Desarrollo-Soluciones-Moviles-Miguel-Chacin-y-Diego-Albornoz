import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import MapView, {
  Marker,
} from 'react-native-maps';

import api from '../services/api';
import { COLORS } from '../theme/colors';

export default function StopDetailScreen({
  route,
}) {
  const {
    idParadero,
    codigo: codigoParametro,
    nombre: nombreParametro,
  } = route.params;

  const [paradero, setParadero] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [token, setToken] =
    useState(null);

  const [favorito, setFavorito] =
    useState(false);

  const [checkingFavorite, setCheckingFavorite] =
    useState(false);

  const [updatingFavorite, setUpdatingFavorite] =
    useState(false);

  useEffect(() => {
    loadStop();
    loadSession();
  }, [idParadero]);

  const loadStop = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(
        `/red/stops/${idParadero}`
      );

      const result =
        response.data?.data ??
        response.data;

      setParadero(result);
    } catch (err) {
      setError(
        'No se pudo cargar el detalle del paradero.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async () => {
    try {
      const storedToken =
        await AsyncStorage.getItem(
          'voybus_token'
        );

      setToken(storedToken);

      if (storedToken) {
        await checkFavorite(
          storedToken
        );
      } else {
        setFavorito(false);
      }
    } catch (error) {
      setToken(null);
      setFavorito(false);
    }
  };

  const checkFavorite = async (
    currentToken
  ) => {
    try {
      setCheckingFavorite(true);

      const response = await api.get(
        `/red/favorites/${idParadero}`,
        {
          headers: {
            Authorization:
              `Bearer ${currentToken}`,
          },
        }
      );

      setFavorito(
        response.data?.data?.favorito ===
          true
      );
    } catch (error) {
      setFavorito(false);
    } finally {
      setCheckingFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    if (!token) {
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión para guardar paraderos favoritos.'
      );

      return;
    }

    try {
      setUpdatingFavorite(true);

      const config = {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      };

      if (favorito) {
        await api.delete(
          `/red/favorites/${idParadero}`,
          config
        );

        setFavorito(false);

        Alert.alert(
          'Favoritos',
          'Paradero eliminado de favoritos.'
        );
      } else {
        await api.post(
          `/red/favorites/${idParadero}`,
          {},
          config
        );

        setFavorito(true);

        Alert.alert(
          'Favoritos',
          'Paradero agregado a favoritos.'
        );
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'No se pudo actualizar el favorito.';

      Alert.alert(
        'Favoritos',
        message
      );
    } finally {
      setUpdatingFavorite(false);
    }
  };

  const codigo =
    paradero?.codigo ??
    paradero?.codigo_paradero ??
    codigoParametro;

  const nombre =
    paradero?.nombre ??
    paradero?.nombre_paradero ??
    nombreParametro;

  const latitud = Number(
    paradero?.latitud ??
      paradero?.latitude ??
      paradero?.lat
  );

  const longitud = Number(
    paradero?.longitud ??
      paradero?.longitude ??
      paradero?.lng
  );

  const tieneCoordenadas =
    Number.isFinite(latitud) &&
    Number.isFinite(longitud);

  const recorridos = useMemo(() => {
    const datos =
      paradero?.recorridos ??
      paradero?.lineas ??
      paradero?.recorridosParadero ??
      [];

    if (!Array.isArray(datos)) {
      return [];
    }

    return datos.map(
      (item, index) => {
        const recorrido =
          item.recorrido ??
          item.route ??
          item;

        const linea =
          recorrido.linea ??
          item.linea ??
          item.line ??
          {};

        return {
          key:
            item.id_recorrido_paradero ??
            recorrido.id_recorrido ??
            `${index}`,

          codigoLinea:
            linea.codigo ??
            linea.codigo_linea ??
            item.codigo_linea ??
            '',

          nombreLinea:
            linea.nombre ??
            linea.nombre_linea ??
            item.nombre_linea ??
            'Línea',

          sentido:
            recorrido.sentido ??
            recorrido.direccion ??
            item.sentido ??
            item.direccion ??
            'Recorrido',

          orden:
            item.orden ??
            recorrido.orden ??
            '-',

          color:
            linea.color ??
            item.color ??
            COLORS.primary,
        };
      }
    );
  }, [paradero]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={COLORS.text}
        />

        <Text style={styles.loadingText}>
          Cargando paradero...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadStop}
        >
          <Text style={styles.retryButtonText}>
            Reintentar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
    >
      <View style={styles.headerCard}>
        <View style={styles.stopIcon}>
          <Text style={styles.stopIconText}>
            P
          </Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.code}>
            {codigo}
          </Text>

          <Text style={styles.title}>
            {nombre}
          </Text>
        </View>
      </View>

      {token ? (
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            favorito &&
              styles.favoriteButtonActive,
          ]}
          onPress={toggleFavorite}
          disabled={
            updatingFavorite ||
            checkingFavorite
          }
        >
          {updatingFavorite ||
          checkingFavorite ? (
            <ActivityIndicator
              color={COLORS.text}
            />
          ) : (
            <Text
              style={
                styles.favoriteButtonText
              }
            >
              {favorito
                ? '★ Quitar de favoritos'
                : '☆ Agregar a favoritos'}
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.guestNotice}>
          <Text style={styles.guestNoticeText}>
            Inicia sesión para guardar este
            paradero en favoritos.
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Ubicación
      </Text>

      {tieneCoordenadas ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitud,
              longitude: longitud,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
            }}
          >
            <Marker
              coordinate={{
                latitude: latitud,
                longitude: longitud,
              }}
              title={nombre}
              description={codigo}
            />
          </MapView>

          <View
            style={
              styles.coordinatesCard
            }
          >
            <Text
              style={
                styles.coordinatesText
              }
            >
              Latitud: {latitud}
            </Text>

            <Text
              style={
                styles.coordinatesText
              }
            >
              Longitud: {longitud}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Este paradero no tiene
            ubicación disponible.
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Líneas que pasan por este paradero
      </Text>

      {recorridos.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No hay recorridos asociados a
            este paradero.
          </Text>
        </View>
      ) : (
        recorridos.map((item) => (
          <View
            key={String(item.key)}
            style={styles.routeCard}
          >
            <View
              style={[
                styles.lineIndicator,
                {
                  backgroundColor:
                    item.color,
                },
              ]}
            />

            <View
              style={styles.routeInfo}
            >
              <Text
                style={styles.lineName}
              >
                {item.codigoLinea}{' '}
                {item.nombreLinea}
              </Text>

              <Text
                style={styles.routeText}
              >
                Sentido: {item.sentido}
              </Text>

              <Text
                style={styles.routeText}
              >
                Orden dentro del recorrido:{' '}
                {item.orden}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor:
      COLORS.background,
  },

  loadingText: {
    marginTop: 12,
    color: COLORS.text,
  },

  errorText: {
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 18,
  },

  retryButton: {
    backgroundColor:
      COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 9,
  },

  retryButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },

  stopIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor:
      COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  stopIconText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },

  headerInfo: {
    flex: 1,
  },

  code: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  favoriteButton: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.text,
    borderRadius: 10,
    marginBottom: 22,
  },

  favoriteButtonActive: {
    backgroundColor:
      COLORS.primary,
  },

  favoriteButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 15,
  },

  guestNotice: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 13,
    marginBottom: 22,
  },

  guestNoticeText: {
    color: COLORS.text,
    textAlign: 'center',
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },

  map: {
    height: 300,
    borderRadius: 14,
    marginBottom: 12,
  },

  coordinatesCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
  },

  coordinatesText: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 4,
  },

  routeCard: {
    flexDirection: 'row',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },

  lineIndicator: {
    width: 10,
    borderRadius: 5,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  routeInfo: {
    flex: 1,
  },

  lineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },

  routeText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 3,
  },

  emptyCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 18,
    marginBottom: 24,
  },

  emptyText: {
    color: COLORS.text,
    textAlign: 'center',
  },
});