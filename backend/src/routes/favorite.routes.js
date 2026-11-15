const express = require('express');

const favoriteController = require('../controllers/favorite.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Todas las rutas de favoritos requieren
 * una sesión válida mediante JWT.
 */

// Lista todos los favoritos del usuario.
router.get(
  '/',
  requireAuth,
  favoriteController.getFavorites
);

// Consulta si un paradero es favorito.
router.get(
  '/:idParadero',
  requireAuth,
  favoriteController.checkFavorite
);

// Agrega un paradero a favoritos.
router.post(
  '/:idParadero',
  requireAuth,
  favoriteController.addFavorite
);

// Quita un paradero de favoritos.
router.delete(
  '/:idParadero',
  requireAuth,
  favoriteController.removeFavorite
);

module.exports = router;