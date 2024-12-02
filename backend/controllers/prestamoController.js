import { registrarPrestamo } from '../services/prestamoServices.js';

export const registrarPrestamoController = async (req, res) => {
  const { clienteId, monto, plazo } = req.body;

  if (!clienteId || !monto || !plazo) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const { prestamo, cronograma } = await registrarPrestamo(clienteId, monto, plazo);

    // Retornar la respuesta con los datos del préstamo y el cronograma de pagos
    res.status(201).json({
      mensaje: 'Préstamo registrado con éxito',
      prestamo,
      cronograma
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



