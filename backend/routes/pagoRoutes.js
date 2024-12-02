import express from 'express';
import { registrarPagoController } from '../controllers/pagoController.js';

const router = express.Router();

// Ruta para registrar un pago
router.post('/registrar', registrarPagoController);

export default router;
