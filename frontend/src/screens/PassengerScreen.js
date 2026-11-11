import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import api from '../services/api';
import { COLORS } from '../theme/colors';

export default function PassengerScreen() {
  const [codigoVehiculo, setCodigoVehiculo] = useState('BUS-101');
  const [idVinculacion, setIdVinculacion] = useState(null);
  const [idParadero, setIdParadero] = useState('1');

  // VIA-01: Vincularse al vehículo
  const handleLink = async () => {
    try {
      const response = await api.post('/passenger/link', {
        codigo_vehiculo: codigoVehiculo,
        id_usuario: 1,
        metodo_vinculacion: 'QR'
      });
      if (response.data.success) {
        setIdVinculacion(response.data.data.id_vinculacion);
        Alert.alert('Éxito (VIA-01)', 'Vinculación exitosa con el vehículo');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'No se pudo vincular');
    }
  };

  // VIA-02: Solicitar parada
  const handleRequestStop = async () => {
    if (!idVinculacion) {
      Alert.alert('Atención', 'Primero debes vincularte a un vehículo.');
      return;
    }
    try {
      const response = await api.post('/passenger/request-stop', {
        id_vinculacion: idVinculacion,
        id_paradero: Number(idParadero)
      });
      if (response.data.success) {
        Alert.alert('Éxito (VIA-02)', '¡Solicitud de parada enviada al conductor!');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'No se pudo solicitar la parada');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>VoyBus - Módulo Pasajero</Text>

      <View style={styles.card}>
        <Text style={styles.label}>1. Código del Vehículo (VIA-01):</Text>
        <TextInput
          style={styles.input}
          value={codigoVehiculo}
          onChangeText={setCodigoVehiculo}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.button} onPress={handleLink}>
          <Text style={styles.buttonText}>Vincularse al Bus</Text>
        </TouchableOpacity>
      </View>

      {idVinculacion && (
        <View style={[styles.card, styles.activeCard]}>
          <Text style={styles.label}>2. ID Paradero de Destino (VIA-02):</Text>
          <TextInput
            style={styles.input}
            value={idParadero}
            onChangeText={setIdParadero}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={handleRequestStop}>
            <Text style={styles.stopButtonText}>Solicitar Parada</Text>
          </TouchableOpacity>
        </View>
      )}
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
  activeCard: { 
    borderColor: COLORS.primary, 
    borderWidth: 2 
  },
  label: { 
    fontSize: 15, 
    marginBottom: 8, 
    color: COLORS.text, 
    fontWeight: '600' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 14, 
    backgroundColor: COLORS.background,
    color: COLORS.text 
  },
  button: { 
    backgroundColor: COLORS.primary, 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: COLORS.text, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  stopButton: { 
    backgroundColor: COLORS.accentStop 
  },
  stopButtonText: { 
    color: COLORS.background, 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});