const express = require('express');
const router = express.Router();
const passengerTripController = require('../controllers/passengerTrip.controller');

// Rutas para el pasajero (VIA-01 y VIA-02)
router.post('/link', passengerTripController.linkToVehicle);
router.post('/request-stop', passengerTripController.requestStop);

module.exports = router;