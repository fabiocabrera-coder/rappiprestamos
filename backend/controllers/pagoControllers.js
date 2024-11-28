const Pago = require('../models/pago.js'); // Modelo de Pago
const PagoService = require('../services/pagoServices.js'); // Lógica de negocio para pagos

// Registrar un pago
exports.createPago = async (req, res) => {
    try {
        const pagoData = req.body; // Información del pago
        const pago = await PagoService.registrarPago(pagoData);
        res.status(201).json(pago);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los pagos de un cliente
exports.getPagos = async (req, res) => {
    try {
        const pagos = await Pago.find({ clienteId: req.params.clienteId });
        res.status(200).json(pagos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener los pagos de un préstamo específico
exports.getPagosPorPrestamo = async (req, res) => {
    try {
        const pagos = await Pago.find({ prestamoId: req.params.prestamoId });
        res.status(200).json(pagos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Generar un comprobante de pago
exports.generarComprobante = async (req, res) => {
    try {
        const { tipo, clienteId, monto } = req.body;
        const comprobante = await PagoService.generarComprobante(tipo, clienteId, monto);
        res.status(200).json(comprobante);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
