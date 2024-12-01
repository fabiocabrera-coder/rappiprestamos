const db = require('../config/database');

// Función para registrar un cliente y su información dependiendo si es persona natural o jurídica
export const registrarCliente = async ({ tipoCliente, correo, telefono, dni_ruc, nombre, razon_social, ...otrosCampos }) => {
    const queryCliente = `
        INSERT INTO clientes (correo, telefono)
        VALUES ($1, $2) RETURNING id;
    `;
    const valuesCliente = [correo, telefono];

    try {
        const resCliente = await db.query(queryCliente, valuesCliente);
        const clienteId = resCliente.rows[0].id;

        if (tipoCliente === 'personaNatural') {
            const queryPersonaNatural = `
                INSERT INTO persona_natural (cliente_id, nombre, dni)
                VALUES ($1, $2, $3);
            `;
            const valuesPersonaNatural = [clienteId, nombre, dni_ruc];
            await db.query(queryPersonaNatural, valuesPersonaNatural);
        } else if (tipoCliente === 'personaJuridica') {
            const queryPersonaJuridica = `
                INSERT INTO persona_juridica (cliente_id, razon_social, numero_documento, estado, condicion, direccion, ubigeo, via_tipo, via_nombre, zona_codigo, zona_tipo, numero, distrito, provincia, departamento)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
            `;
            const valuesPersonaJuridica = [
                clienteId, razon_social, dni_ruc, estado, condicion, direccion, ubigeo, 
                viaTipo, viaNombre, zonaCodigo, zonaTipo, numero, distrito, provincia, departamento
            ];
            await db.query(queryPersonaJuridica, valuesPersonaJuridica);
        }
        return clienteId;
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        throw new Error('Error al registrar cliente');
    }
};

