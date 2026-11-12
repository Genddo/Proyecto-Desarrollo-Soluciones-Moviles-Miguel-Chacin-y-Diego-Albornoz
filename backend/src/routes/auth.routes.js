const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Rutas del Módulo de Gestión de Acceso y Cuentas
router.post('/logout', authController.logout); // ACC-03: Cerrar sesión

module.exports = router;