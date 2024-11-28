const clienteRepository = require('../repositories/clienteRepository.js');

// Crear un cliente
exports.createCliente = async (clienteData) => {
    const cliente = await clienteRepository.create(clienteData);
    return cliente;
};

// Obtener todos los clientes
exports.getAllClientes = async () => {
    const clientes = await clienteRepository.findAll();
    return clientes;
};
