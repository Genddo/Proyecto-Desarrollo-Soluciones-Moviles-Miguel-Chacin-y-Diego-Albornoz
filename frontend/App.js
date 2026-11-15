import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  NavigationContainer,
  useFocusEffect,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

import ProfileScreen from './src/screens/ProfileScreen';
import PassengerScreen from './src/screens/PassengerScreen';
import DriverScreen from './src/screens/DriverScreen';

import LinesScreen from './src/screens/LinesScreen';
import LineDetailScreen from './src/screens/LineDetailScreen';

import StopsScreen from './src/screens/StopsScreen';
import StopDetailScreen from './src/screens/StopDetailScreen';

import VehiclesMapScreen from './src/screens/VehiclesMapScreen';

import { COLORS } from './src/theme/colors';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] =
    useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadSession = async () => {
        try {
          const storedUser =
            await AsyncStorage.getItem(
              'voybus_user'
            );

          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            setUser(null);
          }
        } catch (error) {
          setUser(null);
        } finally {
          setCheckingSession(false);
        }
      };

      loadSession();
    }, [])
  );

  if (checkingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.text}
        />

        <Text style={styles.loadingText}>
          Cargando VoyBus...
        </Text>
      </View>
    );
  }

  const rol =
    user?.rol?.toLowerCase() ?? 'invitado';

  const isGuest = !user;

  const canUsePassenger =
    isGuest ||
    rol === 'pasajero' ||
    rol === 'admin';

  const canUseDriver =
    rol === 'conductor' ||
    rol === 'admin';

  const canUseProfile = Boolean(user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        VoyBus - Menú Principal
      </Text>

      <View style={styles.sessionCard}>
        <Text style={styles.sessionTitle}>
          {isGuest
            ? 'Modo invitado'
            : `Hola, ${user.nombre}`}
        </Text>

        <Text style={styles.sessionText}>
          {isGuest
            ? 'Puedes consultar la red y utilizar las funciones públicas.'
            : `Rol: ${rol}`}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Lines')
        }
      >
        <Text style={styles.buttonText}>
          Líneas y recorridos (RED-01)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Stops')
        }
      >
        <Text style={styles.buttonText}>
          Paraderos (RED-02)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Vehicles')
        }
      >
        <Text style={styles.buttonText}>
          Vehículos en circulación (RED-02)
        </Text>
      </TouchableOpacity>

      {canUsePassenger && (
        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
          ]}
          onPress={() =>
            navigation.navigate('Passenger')
          }
        >
          <Text style={styles.buttonText}>
            Módulo Pasajero (VIA-01 / VIA-02)
          </Text>
        </TouchableOpacity>
      )}

      {canUseDriver && (
        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
          ]}
          onPress={() =>
            navigation.navigate('Driver')
          }
        >
          <Text style={styles.buttonText}>
            Módulo Conductor (VEH-01 / VEH-02)
          </Text>
        </TouchableOpacity>
      )}

      {canUseProfile && (
        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
          ]}
          onPress={() =>
            navigation.navigate('Profile')
          }
        >
          <Text style={styles.buttonText}>
            Mi Perfil / Ajustes (ACC-03)
          </Text>
        </TouchableOpacity>
      )}

      {isGuest && (
        <View style={styles.accessContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              navigation.navigate('Login')
            }
          >
            <Text style={styles.loginButtonText}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() =>
              navigation.navigate('Register')
            }
          >
            <Text style={styles.registerButtonText}>
              Crear cuenta
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function App() {
  const [checkingSession, setCheckingSession] =
    useState(true);

  const [initialRoute, setInitialRoute] =
    useState('Login');

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token =
          await AsyncStorage.getItem(
            'voybus_token'
          );

        const user =
          await AsyncStorage.getItem(
            'voybus_user'
          );

        if (token && user) {
          setInitialRoute('Home');
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        setInitialRoute('Login');
      } finally {
        setCheckingSession(false);
      }
    };

    restoreSession();
  }, []);

  if (checkingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.text}
        />

        <Text style={styles.loadingText}>
          Iniciando VoyBus...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: {
            backgroundColor:
              COLORS.primary,
          },

          headerTintColor:
            COLORS.text,

          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Acceso a VoyBus',
          }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: 'Crear cuenta',
          }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'VoyBus Inicio',
          }}
        />

        <Stack.Screen
          name="Lines"
          component={LinesScreen}
          options={{
            title: 'Líneas y recorridos',
          }}
        />

        <Stack.Screen
          name="LineDetail"
          component={LineDetailScreen}
          options={{
            title: 'Detalle de línea',
          }}
        />

        <Stack.Screen
          name="Stops"
          component={StopsScreen}
          options={{
            title: 'Paraderos',
          }}
        />

        <Stack.Screen
          name="StopDetail"
          component={StopDetailScreen}
          options={{
            title: 'Detalle de paradero',
          }}
        />

        <Stack.Screen
          name="Vehicles"
          component={VehiclesMapScreen}
          options={{
            title: 'Vehículos en circulación',
          }}
        />

        <Stack.Screen
          name="Passenger"
          component={PassengerScreen}
          options={{
            title: 'Panel Pasajero',
          }}
        />

        <Stack.Screen
          name="Driver"
          component={DriverScreen}
          options={{
            title: 'Panel Conductor',
          }}
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Perfil de Usuario',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor:
      COLORS.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      COLORS.background,
  },

  loadingText: {
    marginTop: 12,
    color: COLORS.text,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: COLORS.text,
  },

  sessionCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },

  sessionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },

  sessionText: {
    fontSize: 13,
    color: COLORS.text,
  },

  button: {
    backgroundColor:
      COLORS.primary,
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.text,
  },

  secondaryButton: {
    backgroundColor:
      COLORS.surface,
  },

  buttonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  accessContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },

  loginButton: {
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      COLORS.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.text,
    marginRight: 5,
  },

  registerButton: {
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.text,
    marginLeft: 5,
  },

  loginButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },

  registerButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
});