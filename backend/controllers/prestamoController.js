import { consultarDni, consultarRuc } from '../services/clienteServices.js';
import { registrarPrestamo } from '../services/prestamoServices.js';

// Controlador para consultar el DNI
export const consultarDniController = async (req, res) => {
  const { numero } = req.params;
  if (!numero || numero.length < 8) {
    return res.status(400).json({ error: 'El número de DNI es inválido' });
  }
  try {
    const data = await consultarDni(numero);
    if (!data) {
      return res.status(404).json({ error: 'No se encontró información para este DNI' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar el DNI: ' + error.message });
  }
};

// Controlador para consultar el RUC
export const consultarRucController = async (req, res) => {
  const { numero } = req.params;
  if (!numero || numero.length < 11) {
    return res.status(400).json({ error: 'El número de RUC es inválido' });
  }
  try {
    const data = await consultarRuc(numero);
    if (!data) {
      return res.status(404).json({ error: 'No se encontró información para este RUC' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar el RUC: ' + error.message });
  }
};

// Controlador para registrar el préstamo
export const registrarPrestamoController = async (req, res) => {
  const { clienteId, monto, plazo, correo, telefono } = req.body;
  
  if (!clienteId || !monto || !plazo || !correo || !telefono) {
    return res.status(400).json({ error: 'Todos los campos son requeridos para el préstamo' });
  }

  try {
    if (monto > 5000) {
      return res.status(400).json({ error: 'El monto no puede ser mayor a 5000 soles' });
    }
    if (plazo < 1 || plazo > 6) {
      return res.status(400).json({ error: 'El plazo debe estar entre 1 y 6 meses' });
    }

    // Aquí registramos el préstamo
    const prestamo = await registrarPrestamo({
      clienteId,
      monto,
      plazo,
      correo,
      telefono
    });

    res.status(201).json(prestamo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

