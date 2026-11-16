const bcrypt = require('bcryptjs');

const {
  sequelize,
  User,
  Vehicle,
  Trip,
  Line,
  Route,
  Stop,
  RouteStop
} = require('../models');

async function seedDatabase() {
  try {
    // Reinicia la base de datos para dejar un catálogo reproducible.
    await sequelize.sync({ force: true });

    console.log('--- Reiniciando y poblando la base de datos VoyBus ---');

    /*
     * =========================================================
     * 1. USUARIOS DEMO (PASAJERO Y CONDUCTOR)
     * =========================================================
     */

    const passwordHash = await bcrypt.hash('Clave123!', 10);

    await User.create({
      id_usuario: 1,
      nombre: 'User',
      correo: 'user@voybus.cl',
      telefono: '+56911111111',
      password_hash: passwordHash,
      rol: 'pasajero',
      estado: 'activo',
      intentos_fallidos: 0,
      bloqueado_hasta: null
    });

    const conductorPasswordHash = await bcrypt.hash('Chofer123!', 10);

    await User.create({
      id_usuario: 2,
      nombre: 'Conductor Demo',
      correo: 'conductor@voybus.cl',
      telefono: '+56922222222',
      password_hash: conductorPasswordHash,
      rol: 'conductor',
      estado: 'activo',
      intentos_fallidos: 0,
      bloqueado_hasta: null
    });

    /*
     * =========================================================
     * 2. LÍNEAS
     * Mínimo exigido por RED-01: 3 líneas.
     * =========================================================
     */

    const lineas = await Line.bulkCreate([
      {
        id_linea: 1,
        codigo: 'L01',
        nombre: 'Centro - Norte',
        color: '#90E0EF',
        estado: 'activo'
      },
      {
        id_linea: 2,
        codigo: 'L02',
        nombre: 'Centro - Sur',
        color: '#FFF8D6',
        estado: 'activo'
      },
      {
        id_linea: 3,
        codigo: 'L03',
        nombre: 'Costanera',
        color: '#F4F7FB',
        estado: 'suspendido'
      }
    ]);

    /*
     * =========================================================
     * 3. RECORRIDOS
     * Dos sentidos por cada línea.
     * =========================================================
     */

    await Route.bulkCreate([
      {
        id_recorrido: 1,
        id_linea: 1,
        sentido: 'Ida',
        dias_funcionamiento: 'Lunes a Domingo',
        hora_inicio: '06:00',
        hora_fin: '22:00',
        activo: 1
      },
      {
        id_recorrido: 2,
        id_linea: 1,
        sentido: 'Vuelta',
        dias_funcionamiento: 'Lunes a Domingo',
        hora_inicio: '06:00',
        hora_fin: '22:00',
        activo: 1
      },
      {
        id_recorrido: 3,
        id_linea: 2,
        sentido: 'Ida',
        dias_funcionamiento: 'Lunes a Viernes',
        hora_inicio: '06:30',
        hora_fin: '21:30',
        activo: 1
      },
      {
        id_recorrido: 4,
        id_linea: 2,
        sentido: 'Vuelta',
        dias_funcionamiento: 'Lunes a Viernes',
        hora_inicio: '06:30',
        hora_fin: '21:30',
        activo: 1
      },
      {
        id_recorrido: 5,
        id_linea: 3,
        sentido: 'Ida',
        dias_funcionamiento: 'Lunes a Domingo',
        hora_inicio: '07:00',
        hora_fin: '20:00',
        activo: 1
      },
      {
        id_recorrido: 6,
        id_linea: 3,
        sentido: 'Vuelta',
        dias_funcionamiento: 'Lunes a Domingo',
        hora_inicio: '07:00',
        hora_fin: '20:00',
        activo: 1
      }
    ]);

    /*
     * =========================================================
     * 4. PARADEROS
     * Mínimo exigido por RED-02: 10 paraderos.
     * =========================================================
     */

    await Stop.bulkCreate([
      {
        id_paradero: 1,
        codigo: 'P-001',
        nombre: 'Universidad Católica del Norte',
        latitud: -23.6813,
        longitud: -70.4106
      },
      {
        id_paradero: 2,
        codigo: 'P-002',
        nombre: 'Estadio Regional',
        latitud: -23.6656,
        longitud: -70.4019
      },
      {
        id_paradero: 3,
        codigo: 'P-003',
        nombre: 'Parque Brasil',
        latitud: -23.6548,
        longitud: -70.4017
      },
      {
        id_paradero: 4,
        codigo: 'P-004',
        nombre: 'Plaza Colón',
        latitud: -23.6464,
        longitud: -70.3984
      },
      {
        id_paradero: 5,
        codigo: 'P-005',
        nombre: 'Terminal de Buses',
        latitud: -23.6426,
        longitud: -70.3943
      },
      {
        id_paradero: 6,
        codigo: 'P-006',
        nombre: 'Hospital Regional',
        latitud: -23.6287,
        longitud: -70.3932
      },
      {
        id_paradero: 7,
        codigo: 'P-007',
        nombre: 'Mall Plaza Antofagasta',
        latitud: -23.6503,
        longitud: -70.4026
      },
      {
        id_paradero: 8,
        codigo: 'P-008',
        nombre: 'Balneario Municipal',
        latitud: -23.6760,
        longitud: -70.4117
      },
      {
        id_paradero: 9,
        codigo: 'P-009',
        nombre: 'Avenida Argentina',
        latitud: -23.6610,
        longitud: -70.3950
      },
      {
        id_paradero: 10,
        codigo: 'P-010',
        nombre: 'Sector Norte',
        latitud: -23.6105,
        longitud: -70.3901
      }
    ]);

    /*
     * =========================================================
     * 5. PARADEROS ORDENADOS POR RECORRIDO
     * =========================================================
     */

    await RouteStop.bulkCreate([
      // L01 - Ida
      { id_recorrido: 1, id_paradero: 1, orden: 1 },
      { id_recorrido: 1, id_paradero: 2, orden: 2 },
      { id_recorrido: 1, id_paradero: 3, orden: 3 },
      { id_recorrido: 1, id_paradero: 4, orden: 4 },
      { id_recorrido: 1, id_paradero: 5, orden: 5 },
      { id_recorrido: 1, id_paradero: 6, orden: 6 },
      { id_recorrido: 1, id_paradero: 10, orden: 7 },

      // L01 - Vuelta
      { id_recorrido: 2, id_paradero: 10, orden: 1 },
      { id_recorrido: 2, id_paradero: 6, orden: 2 },
      { id_recorrido: 2, id_paradero: 5, orden: 3 },
      { id_recorrido: 2, id_paradero: 4, orden: 4 },
      { id_recorrido: 2, id_paradero: 3, orden: 5 },
      { id_recorrido: 2, id_paradero: 2, orden: 6 },
      { id_recorrido: 2, id_paradero: 1, orden: 7 },

      // L02 - Ida
      { id_recorrido: 3, id_paradero: 6, orden: 1 },
      { id_recorrido: 3, id_paradero: 5, orden: 2 },
      { id_recorrido: 3, id_paradero: 4, orden: 3 },
      { id_recorrido: 3, id_paradero: 9, orden: 4 },
      { id_recorrido: 3, id_paradero: 2, orden: 5 },
      { id_recorrido: 3, id_paradero: 8, orden: 6 },
      { id_recorrido: 3, id_paradero: 1, orden: 7 },

      // L02 - Vuelta
      { id_recorrido: 4, id_paradero: 1, orden: 1 },
      { id_recorrido: 4, id_paradero: 8, orden: 2 },
      { id_recorrido: 4, id_paradero: 2, orden: 3 },
      { id_recorrido: 4, id_paradero: 9, orden: 4 },
      { id_recorrido: 4, id_paradero: 4, orden: 5 },
      { id_recorrido: 4, id_paradero: 5, orden: 6 },
      { id_recorrido: 4, id_paradero: 6, orden: 7 },

      // L03 - Ida
      { id_recorrido: 5, id_paradero: 8, orden: 1 },
      { id_recorrido: 5, id_paradero: 7, orden: 2 },
      { id_recorrido: 5, id_paradero: 4, orden: 3 },
      { id_recorrido: 5, id_paradero: 5, orden: 4 },
      { id_recorrido: 5, id_paradero: 6, orden: 5 },
      { id_recorrido: 5, id_paradero: 10, orden: 6 },

      // L03 - Vuelta
      { id_recorrido: 6, id_paradero: 10, orden: 1 },
      { id_recorrido: 6, id_paradero: 6, orden: 2 },
      { id_recorrido: 6, id_paradero: 5, orden: 3 },
      { id_recorrido: 6, id_paradero: 4, orden: 4 },
      { id_recorrido: 6, id_paradero: 7, orden: 5 },
      { id_recorrido: 6, id_paradero: 8, orden: 6 }
    ]);

    /*
     * =========================================================
     * 6. VEHÍCULOS
     * Mínimo exigido por RED-02: 10 vehículos.
     * =========================================================
     */

    await Vehicle.bulkCreate([
      {
        id_vehiculo: 1,
        identificador: 'BUS-101',
        patente: 'AA111AA',
        capacidad: 40,
        estado_operativo: 'operativo'
      },
      {
        id_vehiculo: 2,
        identificador: 'BUS-102',
        patente: 'BB222BB',
        capacidad: 40,
        estado_operativo: 'operativo'
      },
      {
        id_vehiculo: 3,
        identificador: 'BUS-103',
        patente: 'CC333CC',
        capacidad: 40,
        estado_operativo: 'operativo'
      },
      {
        id_vehiculo: 4,
        identificador: 'BUS-104',
        patente: 'DD444DD',
        capacidad: 35,
        estado_operativo: 'operativo'
      },
      {
        id_vehiculo: 5,
        identificador: 'BUS-105',
        patente: 'EE555EE',
        capacidad: 35,
        estado_operativo: 'operativo'
      },
      {
        id_vehiculo: 6,
        identificador: 'BUS-106',
        patente: 'FF666FF',
        capacidad: 40,
        estado_operativo: 'operativo'
      },
      {
        id_vehiculo: 7,
        identificador: 'BUS-107',
        patente: 'GG777GG',
        capacidad: 40,
        estado_operativo: 'operativo'
      },
      {
        id_vehiculo: 8,
        identificador: 'BUS-108',
        patente: 'HH888HH',
        capacidad: 35,
        estado_operativo: 'operativo'
      },
      {
        id_vehiculo: 9,
        identificador: 'BUS-109',
        patente: 'JJ999JJ',
        capacidad: 40,
        estado_operativo: 'operativo'
      },
      {
        id_vehiculo: 10,
        identificador: 'BUS-110',
        patente: 'KK110KK',
        capacidad: 40,
        estado_operativo: 'operativo'
      }
    ]);

    /*
     * =========================================================
     * 7. VIAJES
     * Tres buses circulando y uno finalizado.
     * =========================================================
     */

    await Trip.bulkCreate([
      {
        id_viaje: 1,
        id_turno: 1,
        id_recorrido: 1,
        id_vehiculo: 1,
        orden: 1,
        hora_inicio_real: '08:00',
        estado: 'en_curso',
        ultima_latitud: -23.6548,
        ultima_longitud: -70.4017,
        fecha_ultima_ubicacion: new Date().toISOString()
      },
      {
        id_viaje: 2,
        id_turno: 2,
        id_recorrido: 3,
        id_vehiculo: 2,
        orden: 1,
        hora_inicio_real: '08:10',
        estado: 'en_curso',
        ultima_latitud: -23.6610,
        ultima_longitud: -70.3950,
        fecha_ultima_ubicacion: new Date().toISOString()
      },
      {
        id_viaje: 3,
        id_turno: 3,
        id_recorrido: 5,
        id_vehiculo: 3,
        orden: 1,
        hora_inicio_real: '08:20',
        estado: 'en_curso',
        ultima_latitud: -23.6503,
        ultima_longitud: -70.4026,
        fecha_ultima_ubicacion: new Date().toISOString()
      },
      {
        id_viaje: 4,
        id_turno: 4,
        id_recorrido: 2,
        id_vehiculo: 4,
        orden: 1,
        hora_inicio_real: '06:00',
        hora_fin_real: '07:15',
        estado: 'finalizado',
        ultima_latitud: -23.6813,
        ultima_longitud: -70.4106,
        fecha_ultima_ubicacion: new Date().toISOString()
      }
    ]);

    console.log('Seed ejecutado correctamente.');
    console.log('3 líneas creadas.');
    console.log('6 recorridos creados.');
    console.log('10 paraderos creados.');
    console.log('10 vehículos creados.');
    console.log('3 viajes activos y 1 viaje finalizado creados.');
    console.log('Usuario pasajero demo: user@voybus.cl / Clave123!');
    console.log('Usuario conductor demo: conductor@voybus.cl / Chofer123!');

    process.exit(0);
  } catch (error) {
    console.error('Error crítico al ejecutar el seed:', error);
    process.exit(1);
  }
}

seedDatabase();