const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// ACC-01 - Registrarse
router.post('/register', authController.register);

// ACC-02 - Iniciar sesión
router.post('/login', authController.login);

// ACC-03 - Cerrar sesión
router.post('/logout', authController.logout);

module.exports = router;