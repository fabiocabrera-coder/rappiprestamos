const axios = require('axios');

// URL de la API de consulta
const apiUrl = 'https://apis.net.pe/api/dni'; // Para DNI
const apiUrlRuc = 'https://apis.net.pe/api/ruc'; // Para RUC

// Token de autenticación de la API
const apiToken = 'apis-token-11872.PHNNhm3YVQjGEsDDjeV4RszxGR1Bz5qE';

// Función para obtener datos del DNI
async function obtenerDatosDNI(dni) {
    try {
        const response = await axios.get(`${apiUrl}/${dni}`, {
            headers: { Authorization: apiToken }
        });
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('No se pudo obtener la información del DNI');
    } catch (error) {
        throw new Error(`Error al consultar el DNI: ${error.message}`);
    }
}

// Función para obtener datos del RUC
async function obtenerDatosRUC(ruc) {
    try {
        const response = await axios.get(`${apiUrlRuc}/${ruc}`, {
            headers: { Authorization: apiToken }
        });
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('No se pudo obtener la información del RUC');
    } catch (error) {
        throw new Error(`Error al consultar el RUC: ${error.message}`);
    }
}

module.exports = {
    obtenerDatosDNI,
    obtenerDatosRUC
};
