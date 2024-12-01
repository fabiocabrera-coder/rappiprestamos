import { consultarDni, consultarRuc, registrarCliente } from '../services/clienteServices.js';

// Controlador para consultar el DNI
export const consultarDniController = async (req, res) => {
  const { numero } = req.params;
  try {
    const data = await consultarDni(numero);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para consultar el RUC
export const consultarRucController = async (req, res) => {
  const { numero } = req.params;
  try {
    const data = await consultarRuc(numero);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para registrar un cliente
export const registrarClienteController = async (req, res) => {
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
};








