const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');

// Rutas para el conductor (VEH-01 y VEH-02)
router.post('/start', tripController.startTrip);
router.post('/location', tripController.updateLocation);
router.post('/end', tripController.endTrip);
router.get('/:id_viaje/alerts', tripController.getPendingStopAlerts);

module.exports = router;