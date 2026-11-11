const { Trip, TripLocation, Vehicle, StopRequest, TripLink } = require('../models');
const { Op } = require('sequelize');

class TripService {
  // VEH-01: Iniciar viaje y registrar inicio de GPS
  async startTrip(id_viaje) {
    const trip = await Trip.findByPk(id_viaje);
    if (!trip) throw new Error('El viaje especificado no existe.');
    if (trip.estado === 'en_curso') throw new Error('El conductor ya tiene un viaje en curso.');

    trip.estado = 'en_curso';
    trip.hora_inicio_real = new Date().toISOString();
    await trip.save();

    return trip;
  }

  // VEH-01: Actualizar ubicación GPS del bus en tiempo real
  async updateLocation(id_viaje, latitud, longitud) {
    const trip = await Trip.findByPk(id_viaje);
    if (!trip || trip.estado !== 'en_curso') {
      throw new Error('El viaje no existe o no está en curso.');
    }

    const fecha_hora = new Date().toISOString();

    trip.ultima_latitud = latitud;
    trip.ultima_longitud = longitud;
    trip.fecha_ultima_ubicacion = fecha_hora;
    await trip.save();

    await TripLocation.create({
      id_viaje,
      latitud,
      longitud,
      fecha_hora
    });

    return { latitud, longitud, fecha_hora };
  }

  // VEH-01: Finalizar viaje
  async endTrip(id_viaje) {
    const trip = await Trip.findByPk(id_viaje);
    if (!trip) throw new Error('El viaje no existe.');

    trip.estado = 'finalizado';
    trip.hora_fin_real = new Date().toISOString();
    await trip.save();

    return trip;
  }

  // VIA-01: Vinculación del pasajero a un vehículo mediante código o QR
  async linkToVehicle(data) {
    const { codigo_vehiculo, id_usuario, metodo_vinculacion } = data;

    // Buscar el vehículo de forma flexible (por identificador, patente o ID numérico)
    const vehicle = await Vehicle.findOne({
      where: {
        [Op.or]: [
          { identificador: codigo_vehiculo },
          { patente: codigo_vehiculo },
          ...(Number(codigo_vehiculo) ? [{ id_vehiculo: Number(codigo_vehiculo) }] : [])
        ]
      }
    });

    if (!vehicle) {
      throw new Error(`El vehículo con código '${codigo_vehiculo}' no existe en la base de datos.`);
    }

    // Buscar si hay un viaje en curso
    const activeTrip = await Trip.findOne({ where: { estado: 'en_curso' } });
    if (!activeTrip) {
      throw new Error('No hay ningún viaje en curso actualmente.');
    }

    // Desactivar vinculaciones previas activas de este usuario
    await TripLink.update(
      { activa: 0 },
      { where: { id_usuario, activa: 1 } }
    );

    // Crear la nueva vinculación
    const tripLink = await TripLink.create({
      id_usuario,
      id_viaje: activeTrip.id_viaje,
      metodo_vinculacion: metodo_vinculacion || 'QR',
      activa: 1,
      fecha_vinculacion: new Date().toISOString()
    });

    return tripLink;
  }

  // VIA-02: Selección de destino y solicitud digital de parada
  async requestStop(data) {
    const { id_vinculacion, id_paradero } = data;

    const link = await TripLink.findByPk(id_vinculacion);
    if (!link || link.activa !== 1) {
      throw new Error('La vinculación del pasajero no existe o ya no está activa.');
    }

    const stopRequest = await StopRequest.create({
      id_vinculacion,
      id_paradero,
      estado: 'enviada',
      fecha_solicitud: new Date().toISOString()
    });

    return stopRequest;
  }

  // VEH-02: Recepción de alertas de parada agrupadas para el conductor
  async getPendingStopAlerts(id_viaje) {
    const trip = await Trip.findByPk(id_viaje);
    if (!trip) throw new Error('Viaje no encontrado.');

    const alerts = await StopRequest.findAll({
      include: [{
        model: TripLink,
        where: { id_viaje, activa: 1 },
        attributes: []
      }],
      where: { estado: ['enviada', 'proxima'] }
    });

    const stopCounts = {};
    alerts.forEach(req => {
      const paraderoId = req.id_paradero;
      if (!stopCounts[paraderoId]) {
        stopCounts[paraderoId] = { id_paradero: paraderoId, total_solicitudes: 0 };
      }
      stopCounts[paraderoId].total_solicitudes += 1;
    });

    return Object.values(stopCounts);
  }
}

module.exports = new TripService();