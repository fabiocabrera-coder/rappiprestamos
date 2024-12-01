import axios from 'axios';  // Usamos axios para hacer las peticiones a las APIs externas
import { registrarCliente as registrarClienteModelo } from '../models/cliente.js';  // Importar la función de registrar cliente desde el modelo
import { Cliente, PersonaNatural, PersonaJuridica } from '../models/cliente.js'; // Asegúrate de que tus modelos estén bien definidos

// URL base de las APIs
const RENIEC_URL = 'https://api.apis.net.pe/v2/reniec/dni?numero=';
const SUNAT_URL = 'https://api.apis.net.pe/v2/sunat/ruc?numero=';

// Token de la API
const TOKEN = 'apis-token-11872.PHNNhm3YVQjGEsDDjeV4RszxGR1Bz5qE';

// Función para consultar el DNI
export const consultarDni = async (dni) => {
  try {
    const response = await axios.get(`${RENIEC_URL}${dni}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al consultar el DNI: ' + error.message);
  }
};

// Función para consultar el RUC
export const consultarRuc = async (ruc) => {
  try {
    const response = await axios.get(`${SUNAT_URL}${ruc}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al consultar el RUC: ' + error.message);
  }
};

// Registrar un cliente con su correspondiente información
export const registrarCliente = async (datosCliente) => {
  const { tipoCliente, correo, telefono, documento } = datosCliente;

  let cliente = null;
  let persona = null;

  try {
    // Primero creamos el cliente base en la base de datos
    cliente = await Cliente.create({
      correo,
      telefono
    });

    if (tipoCliente === 'personaNatural') {
      // Si es persona natural, consultamos los datos del DNI
      const dniData = await consultarDni(documento);
      persona = await PersonaNatural.create({
        cliente_id: cliente.id,
        nombre: dniData.nombres + ' ' + dniData.apellidoPaterno + ' ' + dniData.apellidoMaterno,
        dni: dniData.numeroDocumento
      });
    } else if (tipoCliente === 'personaJuridica') {
      // Si es persona jurídica, consultamos los datos del RUC
      const rucData = await consultarRuc(documento);
      persona = await PersonaJuridica.create({
        cliente_id: cliente.id,
        razon_social: rucData.nombre,
        numero_documento: rucData.numeroDocumento,
        estado: rucData.estado,
        condicion: rucData.condicion,
        direccion: rucData.direccion,
        ubigeo: rucData.ubigeo,
        via_tipo: rucData.viaTipo,
        via_nombre: rucData.viaNombre,
        zona_codigo: rucData.zonaCodigo,
        zona_tipo: rucData.zonaTipo,
        numero: rucData.numero,
        distrito: rucData.distrito,
        provincia: rucData.provincia,
        departamento: rucData.departamento
      });
    }

    return { cliente, persona };
  } catch (error) {
    throw new Error('Error al registrar el cliente: ' + error.message);
  }
};


