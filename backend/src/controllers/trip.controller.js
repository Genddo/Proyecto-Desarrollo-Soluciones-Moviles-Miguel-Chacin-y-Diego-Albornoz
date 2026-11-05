const tripService = require('../services/trip.service');

exports.startTrip = async (req, res) => {
  try {
    const { id_viaje } = req.body;
    const result = await tripService.startTrip(id_viaje);
    res.status(200).json({ success: true, message: 'Viaje iniciado con éxito', data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { id_viaje, latitud, longitud } = req.body;
    const result = await tripService.updateLocation(id_viaje, latitud, longitud);
    res.status(200).json({ success: true, message: 'Ubicación GPS actualizada', data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.endTrip = async (req, res) => {
  try {
    const { id_viaje } = req.body;
    const result = await tripService.endTrip(id_viaje);
    res.status(200).json({ success: true, message: 'Viaje finalizado', data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getPendingStopAlerts = async (req, res) => {
  try {
    const { id_viaje } = req.params;
    const alerts = await tripService.getPendingStopAlerts(id_viaje);
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};