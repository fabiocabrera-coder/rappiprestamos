const db = require('../config/database');

// Función para registrar un cliente
const registrarCliente = async (cliente) => {
    const { dni_ruc, nombre, direccion, telefono, correo, fecha_nacimiento } = cliente;
    const query = `
        INSERT INTO clientes (dni_ruc, nombre, direccion, telefono, correo, fecha_nacimiento)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
    `;
    const values = [dni_ruc, nombre, direccion, telefono, correo, fecha_nacimiento];

    try {
        const res = await db.query(query, values);
        return res.rows[0].id; // Retorna el ID del nuevo cliente registrado
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        throw new Error('Error al registrar cliente');
    }
};

module.exports = {
    registrarCliente,
};
