const express = require('express');
const cors = require('cors');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Ruta de prueba inicial para verificar que la API responde
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor de VoyBus funcionando correctamente' });
  });

  return app;
};

module.exports = createApp;