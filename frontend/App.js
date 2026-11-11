import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import PassengerScreen from './src/screens/PassengerScreen';
import DriverScreen from './src/screens/DriverScreen';
import { COLORS } from './src/theme/colors';

const Stack = createNativeStackNavigator();

// Pantalla de Menú Principal para elegir entre Pasajero y Conductor
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VoyBus - Menú Principal</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Passenger')}
      >
        <Text style={styles.buttonText}>Módulo Pasajero (VIA-01 / VIA-02)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.driverButton]} 
        onPress={() => navigation.navigate('Driver')}
      >
        <Text style={styles.buttonText}>Módulo Conductor (VEH-01 / VEH-02)</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.text,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'VoyBus Inicio' }} />
        <Stack.Screen name="Passenger" component={PassengerScreen} options={{ title: 'Panel Pasajero' }} />
        <Stack.Screen name="Driver" component={DriverScreen} options={{ title: 'Panel Conductor' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLORS.background 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center', 
    color: COLORS.text 
  },
  button: { 
    backgroundColor: COLORS.primary, 
    padding: 16, 
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.text
  },
  driverButton: {
    backgroundColor: COLORS.surface,
  },
  buttonText: { 
    color: COLORS.text, 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});