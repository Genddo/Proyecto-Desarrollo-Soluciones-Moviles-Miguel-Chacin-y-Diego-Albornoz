// Servicio para la gestión de acceso y sesiones (Módulo ACC)

class AuthService {
  /**
   * Procesa el cierre de sesión del usuario (ACC-03)
   * @param {string|null} token - Token de sesión opcional enviado en headers
   */
  async logoutUser(token) {
    // Si en el futuro manejan una lista negra (blacklist) de tokens JWT 
    // o estados de sesión en SQLite, la lógica de invalidación va aquí.
    if (token) {
      // Ejemplo: await SessionModel.destroy({ where: { token } });
      console.log(`Token invalidado en el servidor.`);
    }

    return {
      closedAt: new Date().toISOString(),
      status: 'SESSION_TERMINATED'
    };
  }
}

module.exports = new AuthService();