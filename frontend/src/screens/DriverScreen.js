import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import api from '../services/api';
import { COLORS } from '../theme/colors';

export default function DriverScreen() {
  const [tripStarted, setTripStarted] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // VEH-01: Iniciar viaje y simular envío de GPS
  const handleStartTrip = async () => {
    try {
      const response = await api.post('/trips/location', {
        id_viaje: 1,
        latitud: -23.6515,
        longitud: -70.3980
      });
      setTripStarted(true);
      Alert.alert('Éxito (VEH-01)', 'Viaje iniciado y ubicación GPS transmitida.');
      fetchAlerts();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'No se pudo iniciar el viaje');
    }
  };

  // VEH-02: Obtener alertas pendientes de los pasajeros
  const fetchAlerts = async () => {
    try {
      const response = await api.get('/trips/1/alerts');
      if (response.data.success) {
        setAlerts(response.data.data);
      }
    } catch (error) {
      console.log('Error al obtener alertas', error);
    }
  };

  useEffect(() => {
    if (tripStarted) {
      const interval = setInterval(fetchAlerts, 5000); // Consulta periódica cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [tripStarted]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>VoyBus - Módulo Conductor</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Control de Viaje (VEH-01):</Text>
        <TouchableOpacity 
          style={[styles.button, tripStarted ? styles.activeButton : null]} 
          onPress={handleStartTrip}
        >
          <Text style={styles.buttonText}>
            {tripStarted ? 'Viaje en Curso (GPS Activo)' : 'Iniciar Viaje y Transmitir GPS'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Alertas de Parada de Pasajeros (VEH-02):</Text>
        {alerts.length === 0 ? (
          <Text style={styles.emptyText}>No hay paradas solicitadas todavía.</Text>
        ) : (
          alerts.map((item, index) => (
            <View key={index} style={styles.alertItem}>
              <Text style={styles.alertText}>Paradero ID: {item.id_paradero}</Text>
              <Text style={styles.alertBadge}>Solicitudes: {item.total_solicitudes}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 20, 
    justifyContent: 'center', 
    backgroundColor: COLORS.background 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    textAlign: 'center', 
    color: COLORS.text 
  },
  card: { 
    backgroundColor: COLORS.surface, 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 16, 
    borderColor: COLORS.border, 
    borderWidth: 1, 
    elevation: 2 
  },
  label: { 
    fontSize: 15, 
    marginBottom: 12, 
    color: COLORS.text, 
    fontWeight: '600' 
  },
  button: { 
    backgroundColor: COLORS.primary, 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  activeButton: { 
    backgroundColor: '#4BB543' // Verde indicador de activo
  },
  buttonText: { 
    color: COLORS.text, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  emptyText: { 
    color: '#666', 
    fontStyle: 'italic', 
    textAlign: 'center', 
    marginVertical: 10 
  },
  alertItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: COLORS.background, 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 8, 
    borderWidth: 1, 
    borderColor: COLORS.border 
  },
  alertText: { 
    color: COLORS.text, 
    fontWeight: 'bold' 
  },
  alertBadge: { 
    color: '#D90429', 
    fontWeight: 'bold' 
  }
});