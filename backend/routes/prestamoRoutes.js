import express from 'express';
import { registrarPrestamoController } from '../controllers/prestamoController.js';

const router = express.Router();

// Ruta para registrar un préstamo
router.post('/registrar', registrarPrestamoController);

export default router;
