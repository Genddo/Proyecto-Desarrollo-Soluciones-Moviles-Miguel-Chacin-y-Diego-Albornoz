const authService = require('../services/auth.service');

/**
 * ACC-01 - Registrar pasajero
 */
const register = async (req, res) => {
  try {
    const {
      nombre,
      correo,
      telefono,
      password,
      confirmPassword
    } = req.body;

    const user = await authService.registerUser({
      nombre,
      correo,
      telefono,
      password,
      confirmPassword
    });

    return res.status(201).json({
      success: true,
      message: 'Cuenta creada correctamente.',
      data: user
    });
  } catch (error) {
    console.error('Error en authController.register:', error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : 'Error interno al crear la cuenta.'
    });
  }
};

/**
 * ACC-02 - Iniciar sesión
 */
const login = async (req, res) => {
  try {
    const {
      correo,
      password
    } = req.body;

    const result = await authService.loginUser({
      correo,
      password
    });

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión correcto.',
      data: result
    });
  } catch (error) {
    console.error('Error en authController.login:', error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : 'Error interno al iniciar sesión.'
    });
  }
};

/**
 * ACC-03 - Cerrar sesión
 */
const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    const result = await authService.logoutUser(token);

    return res.status(200).json({
      success: true,
      message: 'Sesión cerrada correctamente.',
      data: result
    });
  } catch (error) {
    console.error('Error en authController.logout:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno al cerrar la sesión.'
    });
  }
};

module.exports = {
  register,
  login,
  logout
};