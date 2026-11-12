import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../theme/colors';
import api from '../services/api';

export default function ProfileScreen({ navigation }) {

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas salir de tu cuenta?",
      [
        { 
          text: "Cancelar", 
          style: "cancel" 
        },
        { 
          text: "Sí, salir", 
          style: "destructive",
          onPress: async () => {
            try {
              // Llamada al endpoint del backend que creamos (ACC-03)
              await api.post('/auth/logout');
            } catch (error) {
              console.log("Aviso: No se pudo contactar al servidor en el logout, procediendo localmente.");
            }

            // ACC-03: Restablecer la navegación para limpiar la pila 
            // e impedir regresar a pantallas protegidas con el botón "atrás" del teléfono
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }], // Asumiendo que 'Home' es tu menú principal
            });
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil / Configuración</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Usuario: Pasajero VoyBus</Text>
        <Text style={styles.label}>Correo: pasajero@voybus.cl</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    backgroundColor: COLORS.background 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: COLORS.text 
  },
  card: { 
    backgroundColor: COLORS.surface, 
    padding: 20, 
    borderRadius: 10, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.text
  },
  label: { 
    fontSize: 16, 
    color: COLORS.text, 
    marginBottom: 10 
  },
  logoutButton: { 
    backgroundColor: '#D90429', // Color rojo institucional para salida
    padding: 16, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  logoutButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});