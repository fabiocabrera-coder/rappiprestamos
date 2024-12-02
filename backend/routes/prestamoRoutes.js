import express from 'express';
import { registrarPrestamoController } from '../controllers/prestamoController.js';

const router = express.Router();

// Ruta para registrar un préstamo
router.post('/prestamos', registrarPrestamoController);

router.get('/prestamos', registrarPrestamoController);

export default router;
