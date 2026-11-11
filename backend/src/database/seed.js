const { sequelize, User, Vehicle, Trip, Line, Route, Stop } = require('../models');

async function seedDatabase() {
  try {
    // Sincroniza y limpia la base de datos desde cero
    await sequelize.sync({ force: true });
    console.log('--- Reiniciando y poblando la base de datos ---');

    // 1. Crear el usuario pasajero (ID 1)
    await User.create({
      id_usuario: 1,
      nombre: 'Diego Albornoz',
      correo: 'diego@voybus.cl',
      telefono: '+56912345678',
      rol: 'pasajero'
    });

    // 2. Crear el vehículo (Identificador 'BUS-101')
    const vehicle = await Vehicle.create({
      id_vehiculo: 1,
      identificador: 'BUS-101',
      patente: 'AB123CD',
      capacidad: 40,
      estado_operativo: 'operativo'
    });

    // 3. Crear una Línea de transporte
    const line = await Line.create({
      id_linea: 1,
      codigo: 'L01',
      nombre: 'Línea 01 - Centro / Norte',
      color: '#90E0EF',
      estado: 'activo'
    });

    // 4. Crear un Recorrido asociado
    const route = await Route.create({
      id_recorrido: 1,
      id_linea: line.id_linea,
      sentido: 'Ida',
      dias_funcionamiento: 'Lunes a Viernes',
      hora_inicio: '06:00',
      hora_fin: '22:00',
      activo: 1
    });

    // 5. Crear el Viaje en curso (ID 1, vinculado al vehículo y recorrido)
    await Trip.create({
      id_viaje: 1,
      id_turno: 1,
      id_recorrido: route.id_recorrido,
      orden: 1,
      estado: 'en_curso',
      ultima_latitud: -23.6509,
      ultima_longitud: -70.3975,
      fecha_ultima_ubicacion: new Date().toISOString()
    });

    // 6. Crear el Paradero (ID 1, para evitar errores de llave foránea al solicitar parada)
    await Stop.create({
      id_paradero: 1,
      codigo: 'P-001',
      nombre: 'Paradero Universidad Católica',
      latitud: -23.6510,
      longitud: -70.3980
    });

    console.log(' ¡Seed ejecutado con éxito! Todos los datos de prueba están listos.');
    process.exit(0);
  } catch (error) {
    console.error(' Error crítico al ejecutar el seed:', error);
    process.exit(1);
  }
}

seedDatabase();