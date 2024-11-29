const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Ruta para registrar un cliente
router.post('/registro', clienteController.registrarCliente);

module.exports = router;
