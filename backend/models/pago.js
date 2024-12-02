import { client } from '../config/database.js';

export const registrarPago = async ({ clienteId, prestamoId, monto, tipoPago }) => {
  const query = `
    INSERT INTO pagos (cliente_id, prestamo_id, monto, tipo_pago, fecha_pago)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id, cliente_id, prestamo_id, monto, tipo_pago, fecha_pago;
  `;
  const values = [clienteId, prestamoId, monto, tipoPago];

  try {
    const res = await client.query(query, values);
    return res.rows[0];
  } catch (error) {
    throw new Error('Error al registrar el pago: ' + error.message);
  }
};

// Modelo de Pago (función de acceso a la base de datos)
export const Pago = {
  create: registrarPago
};
