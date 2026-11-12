const authService = require('../services/auth.service');

// Controlador para la gestión de cuentas y acceso (Módulo ACC)
const logout = async (req, res) => {
  try {
    // Extraer token opcional del header Authorization (Bearer <token>)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
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
  logout
};