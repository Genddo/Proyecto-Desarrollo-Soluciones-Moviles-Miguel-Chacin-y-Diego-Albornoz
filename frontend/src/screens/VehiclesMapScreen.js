import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MapView, {
  Marker,
} from 'react-native-maps';

import api from '../services/api';
import { COLORS } from '../theme/colors';

export default function VehiclesMapScreen() {
  const [vehicles, setVehicles] = useState([]);
  const [lines, setLines] = useState([]);

  const [selectedLine, setSelectedLine] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLines();
  }, []);

  useEffect(() => {
    loadVehicles();

    // Actualiza automáticamente los vehículos cada 5 segundos.
    const interval = setInterval(() => {
      loadVehicles(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedLine]);

  const loadLines = async () => {
    try {
      const response = await api.get('/red/lines');

      const result =
        response.data?.data ?? response.data;

      const list = Array.isArray(result)
        ? result
        : result?.lines ?? [];

      setLines(list);
    } catch (err) {
      console.log(
        'No se pudieron cargar las líneas.'
      );
    }
  };

  const loadVehicles = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError('');

      const params = {};

      if (selectedLine) {
        params.idLinea = selectedLine;
      }

      const response = await api.get(
        '/red/vehicles',
        {
          params,
        }
      );

      const result =
        response.data?.data ?? response.data;

      const list = Array.isArray(result)
        ? result
        : result?.vehicles ?? [];

      setVehicles(list);
    } catch (err) {
      setError(
        'No se pudo cargar la ubicación de los vehículos.'
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const normalizedVehicles = useMemo(() => {
    return vehicles
      .map((item) => {
        const vehicle =
          item.vehiculo ??
          item.vehicle ??
          {};

        const linea =
          item.linea ??
          {};

        const recorrido =
          item.recorrido ??
          {};

        const ubicacion =
          item.ubicacion ??
          {};

        const latitude = Number(
          ubicacion.latitud
        );

        const longitude = Number(
          ubicacion.longitud
        );

        return {
          id:
            item.id_viaje ??
            vehicle.id_vehiculo,

          identifier:
            vehicle.identificador ??
            `Vehículo ${vehicle.id_vehiculo ?? ''}`,

          patente:
            vehicle.patente ??
            '',

          lineId:
            linea.id_linea,

          lineCode:
            linea.codigo ??
            '',

          lineName:
            linea.nombre ??
            '',

          lineColor:
            linea.color ??
            COLORS.primary,

          direction:
            recorrido.sentido ??
            '',

          latitude,
          longitude,

          updatedAt:
            ubicacion.ultima_actualizacion ??
            '',
        };
      })
      .filter(
        (item) =>
          Number.isFinite(item.latitude) &&
          Number.isFinite(item.longitude)
      );
  }, [vehicles]);

  const region = useMemo(() => {
    if (normalizedVehicles.length === 0) {
      return {
        latitude: -23.6509,
        longitude: -70.3975,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      };
    }

    const latitudes =
      normalizedVehicles.map(
        (item) => item.latitude
      );

    const longitudes =
      normalizedVehicles.map(
        (item) => item.longitude
      );

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);

    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return {
      latitude:
        (minLat + maxLat) / 2,

      longitude:
        (minLng + maxLng) / 2,

      latitudeDelta: Math.max(
        maxLat - minLat + 0.04,
        0.06
      ),

      longitudeDelta: Math.max(
        maxLng - minLng + 0.04,
        0.06
      ),
    };
  }, [normalizedVehicles]);

  const formatDate = (value) => {
    if (!value) {
      return 'Sin información';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Vehículos en circulación
      </Text>

      <Text style={styles.subtitle}>
        Ubicación de los vehículos con viajes activos.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={
          styles.filterContainer
        }
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedLine === null &&
              styles.filterButtonActive,
          ]}
          onPress={() =>
            setSelectedLine(null)
          }
        >
          <Text style={styles.filterText}>
            Todas
          </Text>
        </TouchableOpacity>

        {lines.map((line) => (
          <TouchableOpacity
            key={String(line.id_linea)}
            style={[
              styles.filterButton,
              selectedLine === line.id_linea &&
                styles.filterButtonActive,
            ]}
            onPress={() =>
              setSelectedLine(line.id_linea)
            }
          >
            <Text style={styles.filterText}>
              {line.codigo}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={COLORS.text}
          />

          <Text style={styles.loadingText}>
            Cargando vehículos...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              loadVehicles(true)
            }
          >
            <Text style={styles.retryButtonText}>
              Reintentar
            </Text>
          </TouchableOpacity>
        </View>
      ) : normalizedVehicles.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>
            No hay vehículos activos
          </Text>

          <Text style={styles.emptyText}>
            No existen viajes en curso para la selección actual.
          </Text>
        </View>
      ) : (
        <>
          <MapView
            key={
              selectedLine === null
                ? 'all'
                : String(selectedLine)
            }
            style={styles.map}
            initialRegion={region}
          >
            {normalizedVehicles.map(
              (vehicle) => (
                <Marker
                  key={String(vehicle.id)}
                  coordinate={{
                    latitude:
                      vehicle.latitude,
                    longitude:
                      vehicle.longitude,
                  }}
                  title={vehicle.identifier}
                  description={`${vehicle.lineCode} ${vehicle.lineName} - ${vehicle.direction}`}
                  pinColor={
                    vehicle.lineColor
                  }
                />
              )
            )}
          </MapView>

          <ScrollView
            style={styles.vehicleList}
            contentContainerStyle={
              styles.vehicleListContent
            }
          >
            {normalizedVehicles.map(
              (vehicle) => (
                <View
                  key={String(vehicle.id)}
                  style={styles.card}
                >
                  <View
                    style={[
                      styles.lineColor,
                      {
                        backgroundColor:
                          vehicle.lineColor,
                      },
                    ]}
                  />

                  <View style={styles.cardInfo}>
                    <Text
                      style={styles.vehicleName}
                    >
                      {vehicle.identifier}
                    </Text>

                    <Text style={styles.info}>
                      Patente: {vehicle.patente}
                    </Text>

                    <Text style={styles.info}>
                      Línea: {vehicle.lineCode}{' '}
                      {vehicle.lineName}
                    </Text>

                    <Text style={styles.info}>
                      Sentido: {vehicle.direction}
                    </Text>

                    <Text style={styles.info}>
                      Última actualización:{' '}
                      {formatDate(
                        vehicle.updatedAt
                      )}
                    </Text>
                  </View>
                </View>
              )
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 18,
    backgroundColor: COLORS.background,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: 20,
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.text,
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  filterScroll: {
    maxHeight: 52,
    marginBottom: 12,
  },

  filterContainer: {
    paddingHorizontal: 20,
  },

  filterButton: {
    minWidth: 65,
    height: 40,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.text,
    borderRadius: 20,
    marginRight: 8,
  },

  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },

  filterText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },

  map: {
    height: 390,
    marginHorizontal: 15,
    borderRadius: 14,
  },

  vehicleList: {
    flex: 1,
  },

  vehicleListContent: {
    padding: 15,
    paddingBottom: 30,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },

  lineColor: {
    width: 10,
    borderRadius: 5,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardInfo: {
    flex: 1,
  },

  vehicleName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 7,
  },

  info: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
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
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 9,
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
    color: COLORS.text,
    textAlign: 'center',
  },
});