const { Cliente } = require('../models/cliente');

// Crear un cliente
exports.create = async (clienteData) => {
    const cliente = await Cliente.create(clienteData);
    return cliente;
};

// Obtener todos los clientes
exports.findAll = async () => {
    const clientes = await Cliente.findAll();
    return clientes;
};
