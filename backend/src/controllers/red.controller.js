const redService = require('../services/red.service');

/**
 * RED-01
 * Listar líneas y permitir búsqueda por código o nombre.
 */
const getLines = async (req, res) => {
  try {
    const busqueda = req.query.q || '';

    const lines = await redService.getLines(busqueda);

    return res.status(200).json({
      success: true,
      message:
        lines.length > 0
          ? 'Líneas obtenidas correctamente.'
          : 'No se encontraron líneas.',
      data: lines
    });
  } catch (error) {
    console.error('Error en redController.getLines:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno al consultar las líneas.'
    });
  }
};

/**
 * RED-01
 * Obtener detalle de una línea y sus recorridos.
 */
const getLineDetail = async (req, res) => {
  try {
    const { idLinea } = req.params;

    const line = await redService.getLineDetail(idLinea);

    return res.status(200).json({
      success: true,
      message: 'Detalle de línea obtenido correctamente.',
      data: line
    });
  } catch (error) {
    console.error(
      'Error en redController.getLineDetail:',
      error.message
    );

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : 'Error interno al consultar la línea.'
    });
  }
};

/**
 * RED-02
 * Listar paraderos y permitir búsqueda por código o nombre.
 */
const getStops = async (req, res) => {
  try {
    const busqueda = req.query.q || '';

    const stops = await redService.getStops(busqueda);

    return res.status(200).json({
      success: true,
      message:
        stops.length > 0
          ? 'Paraderos obtenidos correctamente.'
          : 'No se encontraron paraderos.',
      data: stops
    });
  } catch (error) {
    console.error('Error en redController.getStops:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno al consultar los paraderos.'
    });
  }
};

/**
 * RED-02
 * Obtener detalle de un paradero.
 */
const getStopDetail = async (req, res) => {
  try {
    const { idParadero } = req.params;

    const stop = await redService.getStopDetail(idParadero);

    return res.status(200).json({
      success: true,
      message: 'Detalle de paradero obtenido correctamente.',
      data: stop
    });
  } catch (error) {
    console.error(
      'Error en redController.getStopDetail:',
      error.message
    );

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : 'Error interno al consultar el paradero.'
    });
  }
};

/**
 * RED-02
 * Listar vehículos asociados a viajes activos.
 * Puede filtrarse por línea.
 */
const getActiveVehicles = async (req, res) => {
  try {
    const idLinea = req.query.idLinea || null;

    const vehicles =
      await redService.getActiveVehicles(idLinea);

    return res.status(200).json({
      success: true,
      message:
        vehicles.length > 0
          ? 'Vehículos activos obtenidos correctamente.'
          : 'No hay vehículos activos para mostrar.',
      data: vehicles
    });
  } catch (error) {
    console.error(
      'Error en redController.getActiveVehicles:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Error interno al consultar los vehículos activos.'
    });
  }
};

module.exports = {
  getLines,
  getLineDetail,
  getStops,
  getStopDetail,
  getActiveVehicles
};