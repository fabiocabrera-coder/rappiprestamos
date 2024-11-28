const Prestamo = require('../models/prestamo.js'); // Modelo de Prestamo
const PrestamoService = require('../services/prestamoServices.js'); // Lógica de negocio para préstamos

// Crear un nuevo préstamo
exports.createPrestamo = async (req, res) => {
    try {
        const prestamoData = req.body; // Recibe la información del préstamo
        const prestamo = await PrestamoService.crearPrestamo(prestamoData);
        res.status(201).json(prestamo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los préstamos activos
exports.getPrestamos = async (req, res) => {
    try {
        const prestamos = await Prestamo.find({ estado: 'activo' });
        res.status(200).json(prestamos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener los detalles de un préstamo por ID
exports.getPrestamoById = async (req, res) => {
    try {
        const prestamo = await Prestamo.findById(req.params.id);
        if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
        res.status(200).json(prestamo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
