const axios = require('axios');
const ClienteModel = require('../models/cliente')

// Función para obtener los datos del cliente desde la API de apis.net.pe
const obtenerDatosCliente = async (documento, tipo) => {
    const token = 'apis-token-11872.PHNNhm3YVQjGEsDDjeV4RszxGR1Bz5qE';  // El token proporcionado
    let apiUrl;

    // Construimos la URL dependiendo si es un DNI o RUC
    if (tipo === 'DNI') {
        apiUrl = `https://api.apis.net.pe/v2/reniec/dni?numero=${documento}`;
    } else if (tipo === 'RUC') {
        apiUrl = `https://api.apis.net.pe/v2/sunat/ruc/full?numero=${documento}`;
    }

    try {
        // Realizamos la solicitud a la API
        const response = await axios.get(apiUrl);
        return response.data;  // Retorna los datos obtenidos de la API
    } catch (error) {
        console.error('Error al obtener datos del cliente desde la API:', error);
        throw new Error('Error al obtener los datos del cliente');
    }
};

// Función para registrar un cliente
exports.registrarCliente = async (req, res) => {
    const { documento, tipo, clienteData } = req.body;  // Documento (DNI o RUC), tipo de documento y los datos del cliente

    try {
        // Paso 1: Obtener los datos del cliente desde la API
        const datosCliente = await obtenerDatosCliente(documento, tipo);

        // Paso 2: Verificar que los datos obtenidos son válidos
        if (!datosCliente || datosCliente.error) {
            return res.status(400).json({ error: 'No se pudo obtener los datos del cliente o los datos no son válidos' });
        }

        // Paso 3: Autocompletar la información (si es necesario)
        let cliente = {};

        if (tipo === 'DNI') {
            cliente = {
                dni_ruc: documento,  // Guardar el DNI
                nombre: datosCliente.nombres || clienteData.nombre,
                direccion: datosCliente.direccion || clienteData.direccion,
                telefono: clienteData.telefono,
                correo: clienteData.correo,
                fecha_nacimiento: clienteData.fecha_nacimiento,
                apellidoPaterno: datosCliente.apellidoPaterno,
                apellidoMaterno: datosCliente.apellidoMaterno,
            };
        } else if (tipo === 'RUC') {
            // Aquí ajustamos los datos para el RUC según la respuesta proporcionada
            cliente = {
                dni_ruc: documento,  // Guardar el RUC
                nombre: datosCliente.nombre || clienteData.nombre,  // Nombre de la empresa o entidad
                direccion: datosCliente.direccion || clienteData.direccion,  // Dirección de la empresa
                telefono: clienteData.telefono,  // Teléfono proporcionado por el cliente
                correo: clienteData.correo,  // Correo proporcionado por el cliente
                estado: datosCliente.estado,  // Estado de la empresa
                condicion: datosCliente.condicion,  // Condición del RUC
                distrito: datosCliente.distrito,  
                provincia: datosCliente.provincia,  
                departamento: datosCliente.departamento,

                ubigeo: datosCliente.ubigeo,  
                viaTipo: datosCliente.viaTipo,  // Tipo de vía (e.g., AV. para Avenida)
                viaNombre: datosCliente.viaNombre,  // Nombre de la vía
                zonaCodigo: datosCliente.zonaCodigo,  
                zonaTipo: datosCliente.zonaTipo,  
                numero: datosCliente.numero,  // Número de la dirección
                interior: datosCliente.interior,  // (si aplica)
                lote: datosCliente.lote,  //  (si aplica)
                dpto: datosCliente.dpto,  //  (si aplica)
                manzana: datosCliente.manzana,  //  (si aplica)
                kilometro: datosCliente.kilometro,  // (si aplica)
            };
        }

        // Paso 4: Registrar al cliente en la base de datos
        const clienteId = await ClienteModel.registrarCliente(cliente);

        // Paso 5: Responder con el ID del cliente registrado
        return res.status(201).json({ message: 'Cliente registrado exitosamente', clienteId });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};




