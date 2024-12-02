import axios from 'axios';  // Usamos axios para hacer las peticiones a las APIs externas
import { Cliente, PersonaNatural, PersonaJuridica } from '../models/cliente.js'; // Importamos los modelos

// URL base de las APIs
const RENIEC_URL = 'https://api.apis.net.pe/v2/reniec/dni?numero=';
const SUNAT_URL = 'https://api.apis.net.pe/v2/sunat/ruc/full?numero=';

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
export const registrarClienteService = async ({ correo, telefono, tipoCliente, documento }) => {
  console.log('Datos recibidos:', { correo, telefono, tipoCliente, documento });

  let cliente = null;
  let persona = null;

  try {
    // Verificamos si el correo ya está registrado
    const clienteExistente = await Cliente.obtenerClientePorCorreo(correo);
    if (clienteExistente) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    // Creamos el cliente
    cliente = await Cliente.create({ correo, telefono, tipoCliente, documento });
    console.log('Cliente creado:', cliente);

    // Si es una persona natural
    if (tipoCliente === 'personaNatural') {
      const dniData = await consultarDni(documento); // Consultamos los datos del DNI
      console.log('DNI Data:', dniData);  // Asegúrate de que los datos sean correctos
      
      persona = await PersonaNatural.create({
        cliente_id: cliente.id,
        nombres: dniData.nombres,
        apellidopaterno: dniData.apellidoPaterno,
        apellidomaterno: dniData.apellidoMaterno,
        dni: dniData.numeroDocumento,
        tipodocumento: dniData.tipoDocumento,
        digitoverificador: dniData.digitoVerificador
      });
      console.log('Peronsa natural creada:', persona);
    } 
    // Si es una persona jurídica
    else if (tipoCliente === 'personaJuridica') {
      const rucData = await consultarRuc(documento); // Consultamos los datos del RUC
      console.log('RUC Data:', rucData);  // Asegúrate de que los datos sean correctos
      persona = await PersonaJuridica.create({
        cliente_id: cliente.id,
        razon_social: rucData.razonSocial,
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
        interior: rucData.interior,
        lote: rucData.lote,
        dpto: rucData.dpto,
        manzana: rucData.manzana,
        kilometro: rucData.kilometro,
        distrito: rucData.distrito,
        provincia: rucData.provincia,
        departamento: rucData.departamento,
        esagenteretencion: rucData.EsAgenteRetencion,
        tipo: rucData.tipo,
        actividadeconomica: rucData.actividadconomica,
        numerotrabajadores: rucData.numeroTrabajadores,
        tipofacturacion: rucData.tipoFacturacion,
        tipocontabilidad: rucData.tipoContabilidad,
        comercioexterior: rucData.comercioExterior
      });
    }

    // Retornamos el cliente y la persona (natural o jurídica) creados
    return { cliente, persona };
  } catch (error) {
    throw new Error('Error al registrar el cliente: ' + error.message);
  }
};




