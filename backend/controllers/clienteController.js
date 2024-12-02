import { consultarDni, consultarRuc, registrarClienteService } from '../services/clienteServices.js';

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

// Controlador para registrar un cliente
export const registrarClienteController = async (req, res) => {
  const { tipoCliente, correo, telefono, documento } = req.body;

  if (!tipoCliente || !correo || !telefono || !documento) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const { cliente, persona } = await registrarClienteService({
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

// Controlador para seleccionar el tipo de documento
export const seleccionarDocumentoController = async (req, res) => {
  const { tipoDocumento, numeroDocumento } = req.body;

  if (!tipoDocumento || !numeroDocumento) {
    return res.status(400).json({ error: 'El tipo de documento y número son requeridos' });
  }

  try {
    let data;

    // Consultamos según el tipo de documento
    if (tipoDocumento === 'dni') {
      data = await consultarDni(numeroDocumento);  // Consultamos a RENIEC
    } else if (tipoDocumento === 'ruc') {
      data = await consultarRuc(numeroDocumento);  // Consultamos a SUNAT
    } else {
      return res.status(400).json({ error: 'Tipo de documento inválido' });
    }

    if (!data) {
      return res.status(404).json({ error: `No se encontró información para el ${tipoDocumento}` });
    }

    // Retornamos los datos obtenidos de RENIEC o SUNAT
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar los datos: ' + error.message });
  }
};










