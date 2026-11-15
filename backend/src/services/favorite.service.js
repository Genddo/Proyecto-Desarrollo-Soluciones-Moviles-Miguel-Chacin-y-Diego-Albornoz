const {
  Stop,
  StopFavorite,
} = require('../models');

/**
 * Obtiene todos los paraderos favoritos de un usuario.
 */
async function getFavorites(idUsuario) {
  return StopFavorite.findAll({
    where: {
      id_usuario: idUsuario,
    },

    include: [
      {
        model: Stop,
        as: 'paradero',
        attributes: [
          'id_paradero',
          'codigo',
          'nombre',
          'latitud',
          'longitud',
          'activo',
        ],
      },
    ],

    order: [
      ['fecha_creacion', 'DESC'],
    ],
  });
}

/**
 * Indica si un paradero ya está guardado
 * como favorito por el usuario.
 */
async function isFavorite(
  idUsuario,
  idParadero
) {
  const favorite =
    await StopFavorite.findOne({
      where: {
        id_usuario: idUsuario,
        id_paradero: idParadero,
      },
    });

  return Boolean(favorite);
}

/**
 * Agrega un paradero a favoritos.
 */
async function addFavorite(
  idUsuario,
  idParadero
) {
  const stop = await Stop.findByPk(
    idParadero
  );

  if (!stop || stop.activo !== 1) {
    const error = new Error(
      'El paradero no existe o no está disponible.'
    );

    error.status = 404;
    throw error;
  }

  const [favorite, created] =
    await StopFavorite.findOrCreate({
      where: {
        id_usuario: idUsuario,
        id_paradero: idParadero,
      },

      defaults: {
        id_usuario: idUsuario,
        id_paradero: idParadero,
      },
    });

  return {
    favorite,
    created,
  };
}

/**
 * Quita un paradero de favoritos.
 */
async function removeFavorite(
  idUsuario,
  idParadero
) {
  const deleted =
    await StopFavorite.destroy({
      where: {
        id_usuario: idUsuario,
        id_paradero: idParadero,
      },
    });

  return deleted > 0;
}

module.exports = {
  getFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
};