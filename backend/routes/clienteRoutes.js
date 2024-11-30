import express from 'express';
import { consultarDni, consultarRuc } from '../controllers/clienteController.js';  // Asegúrate de usar las rutas correctas de tus servicios
const router = express.Router();

// Ruta para consultar el DNI
router.get('/consulta/dni/:numero', async (req, res) => {
  const { numero } = req.params;

  try {
    const data = await consultarDni(numero);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para consultar el RUC
router.get('/consulta/ruc/:numero', async (req, res) => {
  const { numero } = req.params;

  try {
    const data = await consultarRuc(numero);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para registrar un cliente (persona natural o jurídica)
router.post('/registrar', async (req, res) => {
  const { tipoCliente, correo, telefono, documento } = req.body;

  try {
    const { cliente, persona } = await registrarCliente({
      tipoCliente,
      correo,
      telefono,
      documento
    });
    res.status(201).json({ cliente, persona });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exportación usando `export { router }` en lugar de `export default router;`
export { router };

