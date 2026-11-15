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

import api from '../services/api';
import { COLORS } from '../theme/colors';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [loading, setLoading] = useState(false);

  const validarPassword = (value) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,15}$/;

    return regex.test(value);
  };

  const handleRegister = async () => {
    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();
    const telefonoLimpio = telefono.trim();

    if (
      !nombreLimpio ||
      !correoLimpio ||
      !telefonoLimpio ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        'Datos incompletos',
        'Completa todos los campos.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Contraseñas diferentes',
        'La confirmación debe coincidir con la contraseña.'
      );
      return;
    }

    if (!validarPassword(password)) {
      Alert.alert(
        'Contraseña no válida',
        'Debe tener entre 8 y 15 caracteres e incluir mayúscula, minúscula, número y símbolo.'
      );
      return;
    }

    if (!aceptaTerminos) {
      Alert.alert(
        'Términos y privacidad',
        'Debes aceptar los términos y la política de privacidad para crear tu cuenta.'
      );
      return;
    }

    try {
      setLoading(true);

      await api.post('/auth/register', {
        nombre: nombreLimpio,
        correo: correoLimpio,
        telefono: telefonoLimpio,
        password,
        confirmPassword,
      });

      Alert.alert(
        'Cuenta creada',
        'Tu cuenta de pasajero fue creada correctamente.',
        [
          {
            text: 'Iniciar sesión',
            onPress: () => {
              navigation.replace('Login');
            },
          },
        ]
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'No se pudo conectar con el servidor. Intenta nuevamente.';

      Alert.alert(
        'No se pudo crear la cuenta',
        message
      );
    } finally {
      setLoading(false);
    }
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
            Crear cuenta
          </Text>

          <Text style={styles.subtitle}>
            Regístrate como pasajero para acceder a las
            funciones personalizadas de VoyBus.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            Nombre
          </Text>

          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del pasajero"
            placeholderTextColor="#6B7280"
            autoCapitalize="words"
          />

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
          />

          <Text style={styles.label}>
            Teléfono
          </Text>

          <TextInput
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            placeholder="+56911111111"
            placeholderTextColor="#6B7280"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>
            Contraseña
          </Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Crea una contraseña"
              placeholderTextColor="#6B7280"
              secureTextEntry={!mostrarPassword}
              autoCapitalize="none"
              autoCorrect={false}
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

          <Text style={styles.passwordHelp}>
            8 a 15 caracteres, con mayúscula, minúscula,
            número y símbolo.
          </Text>

          <Text style={styles.label}>
            Confirmar contraseña
          </Text>

          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repite tu contraseña"
            placeholderTextColor="#6B7280"
            secureTextEntry={!mostrarPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() =>
              setAceptaTerminos(!aceptaTerminos)
            }
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.checkbox,
                aceptaTerminos && styles.checkboxActive,
              ]}
            >
              {aceptaTerminos && (
                <Text style={styles.checkmark}>
                  ✓
                </Text>
              )}
            </View>

            <Text style={styles.termsText}>
              Acepto los términos y la política de privacidad.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.text} />
            ) : (
              <Text style={styles.primaryButtonText}>
                Crear cuenta
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              navigation.navigate('Login')
            }
          >
            <Text style={styles.loginButtonText}>
              ¿Ya tienes una cuenta? Iniciar sesión
            </Text>
          </TouchableOpacity>
        </View>
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
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
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

  passwordHelp: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.text,
    marginTop: 6,
    marginBottom: 18,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  checkboxActive: {
    backgroundColor: COLORS.primary,
  },

  checkmark: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },

  termsText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
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

  loginButton: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 4,
  },

  loginButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
});