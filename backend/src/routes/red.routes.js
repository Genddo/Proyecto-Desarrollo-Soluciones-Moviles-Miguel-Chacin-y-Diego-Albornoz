const express = require('express');
const router = express.Router();
const redController = require('../controllers/red.controller');

// RED-01 - Consulta de líneas y recorridos
router.get('/lines', redController.getLines);
router.get('/lines/:idLinea', redController.getLineDetail);

// RED-02 - Consulta de paraderos
router.get('/stops', redController.getStops);
router.get('/stops/:idParadero', redController.getStopDetail);

// RED-02 - Visualización de vehículos activos
router.get('/vehicles', redController.getActiveVehicles);

module.exports = router;