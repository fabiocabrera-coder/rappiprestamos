import { registrarPagoService } from '../services/pagoServices.js';

export const registrarPagoController = async (req, res) => {
    try {
        const { documento, prestamoId, monto } = req.body;

        // Validar que los datos estén presentes
        if (!documento || !prestamoId || !monto) {
            return res.status(400).json({ error: 'Todos los campos son requeridos.' });
        }

        // Registrar el pago
        const pago = await registrarPagoService(documento, prestamoId, monto);

        return res.status(201).json({
            mensaje: 'Pago registrado con éxito',
            pago
        });
    } catch (error) {
        console.error('Error al registrar pago:', error.message);
        return res.status(500).json({ error: error.message });
    }
};
