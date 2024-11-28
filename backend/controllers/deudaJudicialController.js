const DeudaJudicial = require('../models/deudaJudicial.js'); // Modelo de Deuda Judicial

// Marcar préstamo como deuda judicial después de 1 año sin pago
exports.marcarDeudaJudicial = async (req, res) => {
    try {
        const prestamoId = req.params.prestamoId;
        const deuda = await DeudaJudicial.create({ prestamoId });
        res.status(200).json(deuda);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las deudas judiciales
exports.getDeudasJudiciales = async (req, res) => {
    try {
        const deudas = await DeudaJudicial.find();
        res.status(200).json(deudas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
