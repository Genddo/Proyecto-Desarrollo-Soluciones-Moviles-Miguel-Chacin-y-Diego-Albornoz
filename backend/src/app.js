const express = require('express');
const cors = require('cors');

const tripRoutes = require('./routes/trip.routes');
const passengerTripRoutes = require('./routes/passengerTrip.routes');
const authRoutes = require('./routes/auth.routes');
const redRoutes = require('./routes/red.routes');
const favoriteRoutes = require('./routes/favorite.routes');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Verifica que la API esté funcionando.
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      message: 'Servidor de VoyBus funcionando correctamente',
    });
  });

  // Módulos existentes.
  app.use('/api/trips', tripRoutes);
  app.use('/api/passenger', passengerTripRoutes);
  app.use('/api/auth', authRoutes);

  // Favoritos protegidos mediante JWT.
  app.use('/api/red/favorites', favoriteRoutes);

  // Consultas públicas de la red.
  app.use('/api/red', redRoutes);

  return app;
};

module.exports = createApp;