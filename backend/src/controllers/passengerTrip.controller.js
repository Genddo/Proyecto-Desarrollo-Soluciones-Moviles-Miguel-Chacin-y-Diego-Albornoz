const passengerTripService = require('../services/passengerTrip.service');

exports.linkToVehicle = async (req, res) => {
  try {
    const { codigo_vehiculo, id_usuario, metodo_vinculacion } = req.body;
    const link = await passengerTripService.linkToVehicle({ codigo_vehiculo, id_usuario, metodo_vinculacion });
    res.status(201).json({ success: true, message: 'Vinculación exitosa con el vehículo', data: link });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.requestStop = async (req, res) => {
  try {
    const { id_vinculacion, id_paradero } = req.body;
    const request = await passengerTripService.requestStop({ id_vinculacion, id_paradero });
    res.status(201).json({ success: true, message: 'Solicitud de parada enviada al conductor', data: request });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};