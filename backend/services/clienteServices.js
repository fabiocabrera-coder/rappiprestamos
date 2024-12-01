import axios from 'axios';  // Usamos axios para hacer las peticiones a las APIs externas
import { Cliente, PersonaNatural, PersonaJuridica } from '../models/cliente.js'; // Importamos los modelos

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

// Función para registrar un nuevo cliente (persona natural o jurídica)
export const registrarClienteService = async ({ tipoCliente, correo, telefono, documento }) => {
  let cliente = null;
  let persona = null;

  try {
    // Primero creamos el cliente base en la base de datos
    cliente = await Cliente.create({ correo, telefono, tipoCliente });

    // Si es una persona natural, buscamos la información en RENIEC
    if (tipoCliente === 'personaNatural') {
      const dniData = await consultarDni(documento); // Consultamos los datos del DNI
      persona = await PersonaNatural.create({
        cliente_id: cliente.id,
        nombre: dniData.nombres + ' ' + dniData.apellidoPaterno + ' ' + dniData.apellidoMaterno,
        dni: dniData.numeroDocumento
      });
    } 
    // Si es una persona jurídica, buscamos la información en SUNAT
    else if (tipoCliente === 'personaJuridica') {
      const rucData = await consultarRuc(documento); // Consultamos los datos del RUC
      persona = await PersonaJuridica.create({
        cliente_id: cliente.id,
        razon_social: rucData.nombre,
        ruc: rucData.numeroDocumento,
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

    // Retornamos el cliente y la persona (natural o jurídica) creados
    return { cliente, persona };
  } catch (error) {
    throw new Error('Error al registrar el cliente: ' + error.message);
  }
};


