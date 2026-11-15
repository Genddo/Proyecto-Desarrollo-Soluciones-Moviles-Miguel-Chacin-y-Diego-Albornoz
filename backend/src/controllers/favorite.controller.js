const favoriteService = require('../services/favorite.service');

/**
 * Lista los paraderos favoritos del usuario autenticado.
 */
async function getFavorites(req, res) {
  try {
    const favorites =
      await favoriteService.getFavorites(
        req.user.id_usuario
      );

    return res.status(200).json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        'No se pudieron consultar los favoritos.',
    });
  }
}

/**
 * Consulta si un paradero específico
 * pertenece a los favoritos del usuario.
 */
async function checkFavorite(req, res) {
  try {
    const { idParadero } = req.params;

    const favorite =
      await favoriteService.isFavorite(
        req.user.id_usuario,
        idParadero
      );

    return res.status(200).json({
      success: true,
      data: {
        favorito: favorite,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        'No se pudo consultar el estado del favorito.',
    });
  }
}

/**
 * Agrega un paradero a favoritos.
 */
async function addFavorite(req, res) {
  try {
    const { idParadero } = req.params;

    const result =
      await favoriteService.addFavorite(
        req.user.id_usuario,
        idParadero
      );

    return res
      .status(result.created ? 201 : 200)
      .json({
        success: true,
        message: result.created
          ? 'Paradero agregado a favoritos.'
          : 'El paradero ya estaba en favoritos.',
        data: result.favorite,
      });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({
        success: false,
        message:
          error.message ||
          'No se pudo agregar el favorito.',
      });
  }
}

/**
 * Quita un paradero de favoritos.
 */
async function removeFavorite(req, res) {
  try {
    const { idParadero } = req.params;

    const removed =
      await favoriteService.removeFavorite(
        req.user.id_usuario,
        idParadero
      );

    return res.status(200).json({
      success: true,
      message: removed
        ? 'Paradero eliminado de favoritos.'
        : 'El paradero no estaba en favoritos.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        'No se pudo eliminar el favorito.',
    });
  }
}

module.exports = {
  getFavorites,
  checkFavorite,
  addFavorite,
  removeFavorite,
};