const { sequelize, User, Vehicle, Trip } = require('../models');

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true }); // Reinicia tablas para insertar datos limpios

    console.log('--- Creando datos de prueba (Seed) ---');

    // 1. Crear usuario pasajero y conductor
    await User.bulkCreate([
      { nombre: 'Pasajero Prueba', correo: 'pasajero@voybus.cl', rol: 'pasajero' },
      { nombre: 'Conductor Juan', correo: 'conductor@voybus.cl', rol: 'conductor' }
    ]);

    // 2. Crear vehículo con identificador para QR
    const vehicle = await Vehicle.create({
      identificador: 'BUS-101', // Código para probar la vinculación por QR/Manual
      patente: 'AB123CD',
      capacidad: 40,
      estado_operativo: 'operativo'
    });

    // 3. Crear viaje asignado
    await Trip.create({
      id_turno: 1,
      id_recorrido: vehicle.id_vehiculo,
      orden: 1,
      estado: 'planificado'
    });

    console.log(' Datos de prueba insertados con éxito en voybus.sqlite');
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar el seed:', error);
    process.exit(1);
  }
}

seedDatabase();