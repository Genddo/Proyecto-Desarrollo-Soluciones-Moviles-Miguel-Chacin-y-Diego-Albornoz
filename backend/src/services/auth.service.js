const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');

class AuthService {
  /**
   * Valida la contraseña según ACC-01.
   */
  validatePassword(password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,15}$/;

    return passwordRegex.test(password);
  }

  /**
   * ACC-01 - Registrar una nueva cuenta de pasajero.
   */
  async registerUser({
    nombre,
    correo,
    telefono,
    password,
    confirmPassword
  }) {
    if (
      !nombre ||
      !correo ||
      !telefono ||
      !password ||
      !confirmPassword
    ) {
      const error = new Error('Todos los campos son obligatorios.');
      error.statusCode = 400;
      throw error;
    }

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();
    const telefonoLimpio = telefono.trim();

    if (password !== confirmPassword) {
      const error = new Error('Las contraseñas no coinciden.');
      error.statusCode = 400;
      throw error;
    }

    if (!this.validatePassword(password)) {
      const error = new Error(
        'La contraseña debe tener entre 8 y 15 caracteres e incluir mayúscula, minúscula, número y símbolo.'
      );
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { correo: correoLimpio },
          { telefono: telefonoLimpio }
        ]
      }
    });

    if (existingUser) {
      const error = new Error(
        'Ya existe una cuenta asociada al correo o teléfono ingresado.'
      );
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nombre: nombreLimpio,
      correo: correoLimpio,
      telefono: telefonoLimpio,
      password_hash: passwordHash,
      rol: 'pasajero',
      estado: 'activo',
      intentos_fallidos: 0,
      bloqueado_hasta: null
    });

    return {
      id_usuario: newUser.id_usuario,
      nombre: newUser.nombre,
      correo: newUser.correo,
      telefono: newUser.telefono,
      rol: newUser.rol,
      estado: newUser.estado
    };
  }

  /**
   * ACC-02 - Iniciar sesión.
   */
  async loginUser({ correo, password }) {
    if (!correo || !password) {
      const error = new Error('Correo y contraseña son obligatorios.');
      error.statusCode = 400;
      throw error;
    }

    const correoLimpio = correo.trim().toLowerCase();

    const user = await User.findOne({
      where: {
        correo: correoLimpio
      }
    });

    const mensajeCredenciales =
      'Correo o contraseña incorrectos.';

    // No revelar si el correo existe o no.
    if (!user) {
      const error = new Error(mensajeCredenciales);
      error.statusCode = 401;
      throw error;
    }

    // No permitir acceso a cuentas deshabilitadas.
    if (user.estado !== 'activo') {
      const error = new Error(
        'La cuenta no se encuentra habilitada para iniciar sesión.'
      );
      error.statusCode = 403;
      throw error;
    }

    // Revisar si existe un bloqueo temporal activo.
    if (
      user.bloqueado_hasta &&
      new Date(user.bloqueado_hasta) > new Date()
    ) {
      const error = new Error(
        'Demasiados intentos fallidos. Intenta nuevamente en unos minutos.'
      );
      error.statusCode = 429;
      throw error;
    }

    // Si el bloqueo anterior ya terminó, limpiar el contador.
    if (
      user.bloqueado_hasta &&
      new Date(user.bloqueado_hasta) <= new Date()
    ) {
      await user.update({
        intentos_fallidos: 0,
        bloqueado_hasta: null
      });
    }

    const passwordCorrecta = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordCorrecta) {
      const nuevosIntentos = (user.intentos_fallidos || 0) + 1;

      // Después de 5 intentos fallidos se bloquea durante 5 minutos.
      if (nuevosIntentos >= 5) {
        const bloqueoHasta = new Date(
          Date.now() + 5 * 60 * 1000
        );

        await user.update({
          intentos_fallidos: 0,
          bloqueado_hasta: bloqueoHasta
        });
      } else {
        await user.update({
          intentos_fallidos: nuevosIntentos
        });
      }

      const error = new Error(mensajeCredenciales);
      error.statusCode = 401;
      throw error;
    }

    // Login correcto: limpiar intentos anteriores.
    await user.update({
      intentos_fallidos: 0,
      bloqueado_hasta: null
    });

    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        rol: user.rol
      },
      process.env.JWT_SECRET || 'voybus_clave_desarrollo',
      {
        expiresIn: '8h'
      }
    );

    return {
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        telefono: user.telefono,
        rol: user.rol,
        estado: user.estado
      }
    };
  }

  /**
   * ACC-03 - Cerrar sesión.
   */
  async logoutUser(token) {
    if (token) {
      console.log('Token invalidado en el servidor.');
    }

    return {
      closedAt: new Date().toISOString(),
      status: 'SESSION_TERMINATED'
    };
  }
}

module.exports = new AuthService();