import { client } from '../src/config/database.js';

/**
 * Función para registrar un nuevo préstamo en la base de datos
 * @param {number} clienteId - ID del cliente
 * @param {number} monto - Monto del préstamo
 * @param {number} montoTotal - Monto total con el interés
 * @param {number} plazo - Plazo del préstamo (1 o 6 meses)
 * @returns {object} - Información del préstamo registrado
 */
export const registrarPrestamo = async ({ clienteId, monto, montoTotal, plazo }) => {
  const query = `
    INSERT INTO prestamos (cliente_id, monto, monto_total, plazo, fecha_registro)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id, cliente_id, monto, monto_total, plazo, fecha_registro;
  `;
  const values = [clienteId, monto, montoTotal, plazo];

  try {
    const res = await client.query(query, values);
    return res.rows[0];  // Retorna el préstamo recién creado
  } catch (error) {
    throw new Error('Error al registrar el préstamo: ' + error.message);
  }
};

/**
 * Función para obtener los préstamos de un cliente
 * @param {number} clienteId - ID del cliente
 * @returns {Array} - Lista de préstamos del cliente
 */
export const obtenerPrestamosPorCliente = async (clienteId) => {
  const query = `
    SELECT id, cliente_id, monto, monto_total, plazo, fecha_registro
    FROM prestamos
    WHERE cliente_id = $1;
  `;
  const values = [clienteId];

  try {
    const res = await client.query(query, values);
    return res.rows;  // Retorna una lista de préstamos
  } catch (error) {
    throw new Error('Error al obtener los préstamos: ' + error.message);
  }
};

/**
 * Función para obtener un préstamo por su ID
 * @param {number} prestamoId - ID del préstamo
 * @returns {object} - Información del préstamo
 */
export const obtenerPrestamoPorId = async (prestamoId) => {
  const query = `
    SELECT id, cliente_id, monto, monto_total, plazo, fecha_registro
    FROM prestamos
    WHERE id = $1;
  `;
  const values = [prestamoId];

  try {
    const res = await client.query(query, values);
    return res.rows[0];  // Retorna el préstamo con el ID especificado
  } catch (error) {
    throw new Error('Error al obtener el préstamo: ' + error.message);
  }
};

/**
 * Función para obtener todos los préstamos registrados
 * @returns {Array} - Lista de todos los préstamos
 */
export const obtenerTodosLosPrestamos = async () => {
  const query = `
    SELECT id, cliente_id, monto, monto_total, plazo, fecha_registro
    FROM prestamos;
  `;

  try {
    const res = await client.query(query);
    return res.rows;  // Retorna una lista de todos los préstamos
  } catch (error) {
    throw new Error('Error al obtener todos los préstamos: ' + error.message);
  }
};

// Modelo de Prestamo (funciones de acceso a la base de datos)
export const Prestamo = {
  create: registrarPrestamo,
  obtenerPrestamosPorCliente,
  obtenerPrestamoPorId,
  obtenerTodosLosPrestamos
};


