import express from 'express';
import { consultarDniController, consultarRucController, registrarClienteController } from '../controllers/clienteController.js';

const router = express.Router();

// Ruta para consultar el DNI
router.get('/consulta/dni/:numero', consultarDniController);

// Ruta para consultar el RUC
router.get('/consulta/ruc/:numero', consultarRucController);

// Ruta para registrar un cliente (persona natural o jurídica)
router.post('/registrar', registrarClienteController);

export { router };

