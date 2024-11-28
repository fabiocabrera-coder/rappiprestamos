const Cliente = require('../models/cliente.js'); // Importa el modelo de Cliente
const ClienteService = require('../services/clienteServices.js'); // Logica de negocio

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
    try {
        const clienteData = req.body; // Recibe la información del cliente
        const cliente = await ClienteService.registrarCliente(clienteData);
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener lista de clientes
exports.getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener cliente por ID
exports.getClienteById = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
        res.status(200).json(cliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
