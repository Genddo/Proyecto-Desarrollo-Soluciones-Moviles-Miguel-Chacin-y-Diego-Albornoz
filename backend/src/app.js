const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Importar rutas de tus requerimientos
const tripRoutes = require('./routes/trip.routes');
const passengerTripRoutes = require('./routes/passengerTrip.routes');
const authRoutes = require('./routes/auth.routes'); // <-- Añadido para ACC-03

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Sincronizar los modelos con la base de datos SQLite
  sequelize.sync({ alter: true })
    .then(() => console.log('Modelos de Sequelize sincronizados correctamente con SQLite.'))
    .catch(err => console.error('Error al sincronizar base de datos:', err));

  // Ruta de prueba inicial para verificar que la API responde
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor de VoyBus funcionando correctamente' });
  });

  // Endpoints de la API
  app.use('/api/trips', tripRoutes);
  app.use('/api/passenger', passengerTripRoutes);
  app.use('/api/auth', authRoutes); // <-- Añadido para ACC-03

  return app;
};

module.exports = createApp;