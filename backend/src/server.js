const createApp = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 8080;
const app = createApp();

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos SQLite establecida con éxito.');

    // Sincroniza los modelos (crea tablas si no existen)
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

startServer();