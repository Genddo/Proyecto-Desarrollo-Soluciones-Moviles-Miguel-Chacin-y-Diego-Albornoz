const { Trip, TripLocation, Vehicle, StopRequest, TripLink } = require('../models');

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

    // Actualizar última ubicación en el Viaje
    trip.ultima_latitud = latitud;
    trip.ultima_longitud = longitud;
    trip.fecha_ultima_ubicacion = fecha_hora;
    await trip.save();

    // Guardar historial en UBICACION_VIAJE
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

  // VEH-02: Recepción de alertas de parada agrupadas para el conductor
  async getPendingStopAlerts(id_viaje) {
    const trip = await Trip.findByPk(id_viaje);
    if (!trip) throw new Error('Viaje no encontrado.');

    // Buscar solicitudes pendientes uniendo con vinculaciones activas de este viaje
    const alerts = await StopRequest.findAll({
      include: [{
        model: TripLink,
        where: { id_viaje, activa: 1 },
        attributes: []
      }],
      where: { estado: ['enviada', 'proxima'] }
    });

    // Agrupar solicitudes por id_paradero y contar cuántas hay
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