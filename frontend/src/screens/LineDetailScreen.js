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
  Polyline,
} from 'react-native-maps';

import api from '../services/api';
import { COLORS } from '../theme/colors';

export default function LineDetailScreen({
  route,
}) {
  const {
    idLinea,
    codigo: codigoParametro,
    nombre: nombreParametro,
  } = route.params;

  const [linea, setLinea] = useState(null);
  const [recorridoSeleccionado, setRecorridoSeleccionado] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLine();
  }, [idLinea]);

  const loadLine = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(
        `/red/lines/${idLinea}`
      );

      const result =
        response.data?.data ?? response.data;

      setLinea(result);

      const recorridos =
        result?.recorridos ??
        result?.routes ??
        [];

      if (recorridos.length > 0) {
        setRecorridoSeleccionado(
          recorridos[0]
        );
      }
    } catch (err) {
      setError(
        'No se pudo cargar el detalle de la línea.'
      );
    } finally {
      setLoading(false);
    }
  };

  const obtenerParaderos = (recorrido) => {
    if (!recorrido) {
      return [];
    }

    const datos =
      recorrido.paraderos ??
      recorrido.paraderosRecorrido ??
      recorrido.stops ??
      [];

    return datos
      .map((item) => {
        const paradero =
          item.paradero ??
          item.stop ??
          item;

        const latitud = Number(
          paradero.latitud ??
            paradero.latitude ??
            paradero.lat ??
            item.latitud ??
            item.latitude
        );

        const longitud = Number(
          paradero.longitud ??
            paradero.longitude ??
            paradero.lng ??
            item.longitud ??
            item.longitude
        );

        return {
          id:
            paradero.id_paradero ??
            paradero.id ??
            item.id_paradero ??
            item.id_recorrido_paradero,

          codigo:
            paradero.codigo ??
            paradero.codigo_paradero ??
            '',

          nombre:
            paradero.nombre ??
            paradero.nombre_paradero ??
            'Paradero',

          orden:
            item.orden ??
            paradero.orden ??
            0,

          latitud,
          longitud,
        };
      })
      .filter(
        (item) =>
          Number.isFinite(item.latitud) &&
          Number.isFinite(item.longitud)
      )
      .sort(
        (a, b) =>
          Number(a.orden) - Number(b.orden)
      );
  };

  const paraderos = useMemo(
    () =>
      obtenerParaderos(
        recorridoSeleccionado
      ),
    [recorridoSeleccionado]
  );

  const coordenadas = paraderos.map(
    (paradero) => ({
      latitude: paradero.latitud,
      longitude: paradero.longitud,
    })
  );

  const region = useMemo(() => {
    if (paraderos.length === 0) {
      return {
        latitude: -23.6509,
        longitude: -70.3975,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      };
    }

    const latitudes = paraderos.map(
      (item) => item.latitud
    );

    const longitudes = paraderos.map(
      (item) => item.longitud
    );

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,

      latitudeDelta: Math.max(
        maxLat - minLat + 0.03,
        0.04
      ),

      longitudeDelta: Math.max(
        maxLng - minLng + 0.03,
        0.04
      ),
    };
  }, [paraderos]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={COLORS.text}
        />

        <Text style={styles.loadingText}>
          Cargando recorrido...
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
          onPress={loadLine}
        >
          <Text style={styles.retryButtonText}>
            Reintentar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const recorridos =
    linea?.recorridos ??
    linea?.routes ??
    [];

  const codigo =
    linea?.codigo ??
    linea?.codigo_linea ??
    codigoParametro;

  const nombre =
    linea?.nombre ??
    linea?.nombre_linea ??
    nombreParametro;

  const estado =
    linea?.estado ??
    'activo';

  const sentido =
    recorridoSeleccionado?.sentido ??
    recorridoSeleccionado?.direccion ??
    'Recorrido';

  const dias =
    recorridoSeleccionado?.dias_operacion ??
    recorridoSeleccionado?.dias ??
    'Horario habitual';

  const horaInicio =
    recorridoSeleccionado?.hora_inicio ??
    recorridoSeleccionado?.horario_inicio ??
    '--:--';

  const horaFin =
    recorridoSeleccionado?.hora_fin ??
    recorridoSeleccionado?.horario_fin ??
    '--:--';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
    >
      <View style={styles.headerCard}>
        <View
          style={[
            styles.lineColor,
            {
              backgroundColor:
                linea?.color ||
                COLORS.primary,
            },
          ]}
        />

        <View style={styles.headerInfo}>
          <Text style={styles.code}>
            {codigo}
          </Text>

          <Text style={styles.title}>
            {nombre}
          </Text>

          <Text style={styles.status}>
            Estado: {estado}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Selecciona el recorrido
      </Text>

      <View style={styles.routesContainer}>
        {recorridos.map((recorrido) => {
          const seleccionado =
            recorridoSeleccionado ===
            recorrido;

          const recorridoSentido =
            recorrido.sentido ??
            recorrido.direccion ??
            `Recorrido ${recorrido.id_recorrido}`;

          return (
            <TouchableOpacity
              key={String(
                recorrido.id_recorrido ??
                  recorrido.id
              )}
              style={[
                styles.routeButton,
                seleccionado &&
                  styles.routeButtonActive,
              ]}
              onPress={() =>
                setRecorridoSeleccionado(
                  recorrido
                )
              }
            >
              <Text
                style={[
                  styles.routeButtonText,
                  seleccionado &&
                    styles.routeButtonTextActive,
                ]}
              >
                {recorridoSentido}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {recorridoSeleccionado && (
        <>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              {sentido}
            </Text>

            <Text style={styles.infoText}>
              Días: {dias}
            </Text>

            <Text style={styles.infoText}>
              Horario: {horaInicio} - {horaFin}
            </Text>

            {paraderos.length > 0 && (
              <>
                <Text style={styles.infoText}>
                  Inicio: {paraderos[0].nombre}
                </Text>

                <Text style={styles.infoText}>
                  Término:{' '}
                  {
                    paraderos[
                      paraderos.length - 1
                    ].nombre
                  }
                </Text>
              </>
            )}
          </View>

          <Text style={styles.sectionTitle}>
            Mapa del recorrido
          </Text>

          <MapView
            key={String(
              recorridoSeleccionado.id_recorrido ??
                recorridoSeleccionado.id
            )}
            style={styles.map}
            initialRegion={region}
          >
            {paraderos.map(
              (paradero, index) => (
                <Marker
                  key={String(
                    paradero.id ??
                      `${paradero.codigo}-${index}`
                  )}
                  coordinate={{
                    latitude:
                      paradero.latitud,
                    longitude:
                      paradero.longitud,
                  }}
                  title={`${index + 1}. ${
                    paradero.nombre
                  }`}
                  description={
                    paradero.codigo
                  }
                />
              )
            )}

            {coordenadas.length >= 2 && (
              <Polyline
                coordinates={coordenadas}
                strokeWidth={4}
              />
            )}
          </MapView>

          <Text style={styles.sectionTitle}>
            Paraderos
          </Text>

          {paraderos.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Este recorrido no tiene
                paraderos disponibles.
              </Text>
            </View>
          ) : (
            paraderos.map(
              (paradero, index) => (
                <View
                  key={String(
                    paradero.id ??
                      `${paradero.codigo}-${index}`
                  )}
                  style={styles.stopCard}
                >
                  <View
                    style={
                      styles.stopNumber
                    }
                  >
                    <Text
                      style={
                        styles.stopNumberText
                      }
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.stopInformation
                    }
                  >
                    <Text
                      style={styles.stopName}
                    >
                      {paradero.nombre}
                    </Text>

                    <Text
                      style={styles.stopCode}
                    >
                      {paradero.codigo}
                    </Text>
                  </View>
                </View>
              )
            )
          )}
        </>
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
    color: COLORS.text,
    textAlign: 'center',
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
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
  },

  lineColor: {
    width: 12,
    borderRadius: 6,
    marginRight: 14,
  },

  headerInfo: {
    flex: 1,
  },

  code: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: 4,
  },

  status: {
    fontSize: 14,
    color: COLORS.text,
    textTransform: 'capitalize',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 4,
  },

  routesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },

  routeButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.text,
    backgroundColor:
      COLORS.background,
    marginRight: 10,
    marginBottom: 8,
  },

  routeButtonActive: {
    backgroundColor:
      COLORS.primary,
  },

  routeButtonText: {
    color: COLORS.text,
    fontWeight: '600',
  },

  routeButtonTextActive: {
    fontWeight: 'bold',
  },

  infoCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 22,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },

  infoText: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 6,
  },

  map: {
    height: 330,
    borderRadius: 14,
    marginBottom: 24,
  },

  stopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },

  stopNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      COLORS.primary,
    marginRight: 12,
  },

  stopNumberText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },

  stopInformation: {
    flex: 1,
  },

  stopName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },

  stopCode: {
    color: COLORS.text,
    fontSize: 13,
    marginTop: 2,
  },

  emptyCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor:
      COLORS.surface,
  },

  emptyText: {
    textAlign: 'center',
    color: COLORS.text,
  },
});