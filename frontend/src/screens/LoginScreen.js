import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../services/api';
import { COLORS } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const correoLimpio = correo.trim();

    if (!correoLimpio || !password) {
      Alert.alert(
        'Datos incompletos',
        'Ingresa tu correo y contraseña.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        correo: correoLimpio,
        password,
      });

      const { token, user } = response.data.data;

      // Guarda localmente la sesión.
      await AsyncStorage.setItem('voybus_token', token);
      await AsyncStorage.setItem(
        'voybus_user',
        JSON.stringify(user)
      );

      Alert.alert(
        'Bienvenido',
        `Hola, ${user.nombre}.`,
        [
          {
            text: 'Continuar',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            },
          },
        ]
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'No se pudo conectar con el servidor. Intenta nuevamente.';

      Alert.alert('No se pudo iniciar sesión', message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.brand}>VoyBus</Text>

          <Text style={styles.title}>
            Iniciar sesión
          </Text>

          <Text style={styles.subtitle}>
            Ingresa a tu cuenta para acceder a tu perfil y
            funciones de pasajero.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            Correo electrónico
          </Text>

          <TextInput
            style={styles.input}
            value={correo}
            onChangeText={setCorreo}
            placeholder="user@voybus.cl"
            placeholderTextColor="#6B7280"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />

          <Text style={styles.label}>
            Contraseña
          </Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#6B7280"
              secureTextEntry={!mostrarPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              style={styles.showButton}
              onPress={() =>
                setMostrarPassword(!mostrarPassword)
              }
            >
              <Text style={styles.showButtonText}>
                {mostrarPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.text} />
            ) : (
              <Text style={styles.primaryButtonText}>
                Iniciar sesión
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() =>
              navigation.navigate('Register')
            }
          >
            <Text style={styles.registerButtonText}>
              ¿No tienes cuenta? Registrarse
            </Text>
          </TouchableOpacity>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>
              o
            </Text>
            <View style={styles.separatorLine} />
          </View>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuest}
          >
            <Text style={styles.guestButtonText}>
              Continuar como invitado
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.helpText}>
          Las consultas de líneas, recorridos y paraderos
          también estarán disponibles sin iniciar sesión.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },

  header: {
    marginBottom: 24,
  },

  brand: {
    fontSize: 34,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },

  input: {
    minHeight: 50,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 18,
  },

  passwordContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    marginBottom: 22,
  },

  passwordInput: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 14,
    fontSize: 16,
    color: COLORS.text,
  },

  showButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  showButtonText: {
    color: COLORS.text,
    fontWeight: '600',
  },

  primaryButton: {
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.text,
  },

  disabledButton: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },

  registerButton: {
    alignItems: 'center',
    paddingVertical: 18,
  },

  registerButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },

  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  separatorText: {
    marginHorizontal: 12,
    color: COLORS.text,
  },

  guestButton: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.text,
  },

  guestButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },

  helpText: {
    marginTop: 20,
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 18,
  },
});