import { registrarPrestamo } from '../services/prestamoServices.js';

// Controlador para registrar un préstamo
export const registrarPrestamoController = async (req, res) => {
  try {
    // Destructuramos los datos del cuerpo de la solicitud
    const { documento, monto, plazo } = req.body;

    // Validamos los datos recibidos
    if (!documento || !monto || !plazo) {
      return res.status(400).json({ error: 'Faltan datos requeridos (documento, monto, plazo).' });
    }

    // Validamos que 'monto' y 'plazo' sean números
    if (isNaN(monto) || isNaN(plazo)) {
      return res.status(400).json({ error: 'El monto y el plazo deben ser números.' });
    }

    // Llamamos a la función de servicio para registrar el préstamo
    const { prestamo, cronograma } = await registrarPrestamo(documento, parseFloat(monto), parseInt(plazo));

    // Devolvemos la respuesta exitosa
    return res.status(201).json({
      prestamo,
      cronograma
    });

  } catch (error) {
    console.error('Error al registrar préstamo:', error.message);
    
    // Si ocurre un error, respondemos con un mensaje de error
    return res.status(500).json({ error: error.message });
  }
};