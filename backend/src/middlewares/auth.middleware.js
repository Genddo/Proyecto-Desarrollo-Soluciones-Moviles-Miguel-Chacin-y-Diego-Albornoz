const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        message: 'Debes iniciar sesión para realizar esta acción.',
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        'voybus_dev_2026_clave_segura'
    );

    req.user = {
      id_usuario: decoded.id_usuario,
      rol: decoded.rol,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'La sesión no es válida o ha expirado.',
    });
  }
}

module.exports = {
  requireAuth,
};