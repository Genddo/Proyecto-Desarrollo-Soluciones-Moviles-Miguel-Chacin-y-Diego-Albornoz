const express = require('express');
const cors = require('cors');

// Rutas existentes
const tripRoutes = require('./routes/trip.routes');
const passengerTripRoutes = require('./routes/passengerTrip.routes');
const authRoutes = require('./routes/auth.routes');

// Rutas del módulo Red
const redRoutes = require('./routes/red.routes');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Ruta para verificar que la API está funcionando
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      message: 'Servidor de VoyBus funcionando correctamente'
    });
  });

  // Módulo de viajes y pasajero
  app.use('/api/trips', tripRoutes);
  app.use('/api/passenger', passengerTripRoutes);

  // Módulo de acceso
  app.use('/api/auth', authRoutes);

  // Módulo de red de transporte
  app.use('/api/red', redRoutes);

  return app;
};

module.exports = createApp;