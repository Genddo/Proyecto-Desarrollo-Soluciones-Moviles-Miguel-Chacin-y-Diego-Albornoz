const { Op } = require('sequelize');

const {
  Line,
  Route,
  Stop,
  RouteStop,
  Trip,
  Vehicle
} = require('../models');

class RedService {
  /**
   * RED-01
   * Obtiene las líneas disponibles.
   * Permite buscar por código o nombre.
   * Las líneas desactivadas no se muestran.
   */
  async getLines(busqueda = '') {
    const where = {
      estado: {
        [Op.ne]: 'desactivado'
      }
    };

    const texto = busqueda.trim();

    if (texto) {
      where[Op.or] = [
        {
          codigo: {
            [Op.like]: `%${texto}%`
          }
        },
        {
          nombre: {
            [Op.like]: `%${texto}%`
          }
        }
      ];
    }

    const lines = await Line.findAll({
      where,
      include: [
        {
          model: Route,
          as: 'recorridos',
          required: false,
          where: {
            activo: 1
          },
          attributes: [
            'id_recorrido',
            'sentido',
            'dias_funcionamiento',
            'hora_inicio',
            'hora_fin'
          ]
        }
      ],
      order: [
        ['codigo', 'ASC'],
        [
          {
            model: Route,
            as: 'recorridos'
          },
          'id_recorrido',
          'ASC'
        ]
      ]
    });

    return lines.map((line) => {
      const item = line.get({ plain: true });

      return {
        id_linea: item.id_linea,
        codigo: item.codigo,
        nombre: item.nombre,
        color: item.color,
        estado: item.estado,
        aviso:
          item.estado === 'suspendido'
            ? 'Servicio temporalmente suspendido.'
            : null,
        recorridos: item.recorridos
      };
    });
  }

  /**
   * RED-01
   * Obtiene el detalle de una línea y sus recorridos,
   * incluyendo los paraderos en el orden correspondiente.
   */
  async getLineDetail(idLinea) {
    const line = await Line.findOne({
      where: {
        id_linea: idLinea,
        estado: {
          [Op.ne]: 'desactivado'
        }
      },
      include: [
        {
          model: Route,
          as: 'recorridos',
          required: false,
          where: {
            activo: 1
          },
          include: [
            {
              model: RouteStop,
              as: 'paraderosRecorrido',
              required: false,
              include: [
                {
                  model: Stop,
                  as: 'paradero',
                  where: {
                    activo: 1
                  },
                  required: false
                }
              ]
            }
          ]
        }
      ],
      order: [
        [
          {
            model: Route,
            as: 'recorridos'
          },
          'id_recorrido',
          'ASC'
        ],
        [
          {
            model: Route,
            as: 'recorridos'
          },
          {
            model: RouteStop,
            as: 'paraderosRecorrido'
          },
          'orden',
          'ASC'
        ]
      ]
    });

    if (!line) {
      const error = new Error('Línea no encontrada.');
      error.statusCode = 404;
      throw error;
    }

    const item = line.get({ plain: true });

    const recorridos = item.recorridos.map((recorrido) => {
      const paraderos = recorrido.paraderosRecorrido
        .filter((rp) => rp.paradero)
        .sort((a, b) => a.orden - b.orden)
        .map((rp) => ({
          orden: rp.orden,
          id_paradero: rp.paradero.id_paradero,
          codigo: rp.paradero.codigo,
          nombre: rp.paradero.nombre,
          latitud: rp.paradero.latitud,
          longitud: rp.paradero.longitud
        }));

      return {
        id_recorrido: recorrido.id_recorrido,
        sentido: recorrido.sentido,
        dias_funcionamiento: recorrido.dias_funcionamiento,
        hora_inicio: recorrido.hora_inicio,
        hora_fin: recorrido.hora_fin,

        punto_inicio:
          paraderos.length > 0
            ? paraderos[0]
            : null,

        punto_termino:
          paraderos.length > 0
            ? paraderos[paraderos.length - 1]
            : null,

        paraderos
      };
    });

    return {
      id_linea: item.id_linea,
      codigo: item.codigo,
      nombre: item.nombre,
      color: item.color,
      estado: item.estado,

      aviso:
        item.estado === 'suspendido'
          ? 'Servicio temporalmente suspendido.'
          : null,

      recorridos
    };
  }

  /**
   * RED-02
   * Consulta y búsqueda de paraderos por código o nombre.
   */
  async getStops(busqueda = '') {
    const where = {
      activo: 1
    };

    const texto = busqueda.trim();

    if (texto) {
      where[Op.or] = [
        {
          codigo: {
            [Op.like]: `%${texto}%`
          }
        },
        {
          nombre: {
            [Op.like]: `%${texto}%`
          }
        }
      ];
    }

    const stops = await Stop.findAll({
      where,
      order: [
        ['codigo', 'ASC']
      ]
    });

    return stops;
  }

  /**
   * RED-02
   * Obtiene un paradero y las líneas/sentidos que pasan por él.
   */
  async getStopDetail(idParadero) {
    const stop = await Stop.findOne({
      where: {
        id_paradero: idParadero,
        activo: 1
      },
      include: [
        {
          model: RouteStop,
          as: 'recorridosParadero',
          required: false,
          include: [
            {
              model: Route,
              as: 'recorrido',
              required: false,
              where: {
                activo: 1
              },
              include: [
                {
                  model: Line,
                  as: 'linea',
                  required: false,
                  where: {
                    estado: {
                      [Op.ne]: 'desactivado'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    });

    if (!stop) {
      const error = new Error('Paradero no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const item = stop.get({ plain: true });

    const recorridos = item.recorridosParadero
      .filter(
        (rp) =>
          rp.recorrido &&
          rp.recorrido.linea
      )
      .map((rp) => ({
        orden: rp.orden,

        id_recorrido:
          rp.recorrido.id_recorrido,

        sentido:
          rp.recorrido.sentido,

        id_linea:
          rp.recorrido.linea.id_linea,

        codigo_linea:
          rp.recorrido.linea.codigo,

        nombre_linea:
          rp.recorrido.linea.nombre,

        color:
          rp.recorrido.linea.color,

        estado_linea:
          rp.recorrido.linea.estado
      }));

    return {
      id_paradero: item.id_paradero,
      codigo: item.codigo,
      nombre: item.nombre,
      latitud: item.latitud,
      longitud: item.longitud,
      recorridos
    };
  }

  /**
   * RED-02
   * Obtiene únicamente vehículos asociados a viajes activos.
   * Opcionalmente filtra por línea.
   */
  async getActiveVehicles(idLinea = null) {
    const routeWhere = {};

    if (idLinea) {
      routeWhere.id_linea = idLinea;
    }

    const trips = await Trip.findAll({
      where: {
        estado: 'en_curso'
      },

      include: [
        {
          model: Vehicle,
          as: 'vehiculo',
          required: true
        },
        {
          model: Route,
          as: 'recorrido',
          required: true,
          where: routeWhere,
          include: [
            {
              model: Line,
              as: 'linea',
              required: true,
              where: {
                estado: {
                  [Op.ne]: 'desactivado'
                }
              }
            }
          ]
        }
      ],

      order: [
        ['id_viaje', 'ASC']
      ]
    });

    return trips.map((trip) => {
      const item = trip.get({ plain: true });

      return {
        id_viaje: item.id_viaje,

        vehiculo: {
          id_vehiculo:
            item.vehiculo.id_vehiculo,

          identificador:
            item.vehiculo.identificador,

          patente:
            item.vehiculo.patente
        },

        linea: {
          id_linea:
            item.recorrido.linea.id_linea,

          codigo:
            item.recorrido.linea.codigo,

          nombre:
            item.recorrido.linea.nombre,

          color:
            item.recorrido.linea.color
        },

        recorrido: {
          id_recorrido:
            item.recorrido.id_recorrido,

          sentido:
            item.recorrido.sentido
        },

        ubicacion: {
          latitud:
            item.ultima_latitud,

          longitud:
            item.ultima_longitud,

          ultima_actualizacion:
            item.fecha_ultima_ubicacion
        }
      };
    });
  }
}

module.exports = new RedService();