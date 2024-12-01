import client from '../config/database.js';  // Importación con la exportación nombrada

// Definimos las funciones para interactuar con la base de datos

// Función para crear un nuevo cliente
export const registrarCliente = async ({ correo, telefono, tipoCliente }) => {
  const query = `
    INSERT INTO cliente (correo, telefono, tipo_cliente)
    VALUES ($1, $2, $3)
    RETURNING id, correo, telefono, tipo_Cliente;
  `;
  const values = [correo, telefono];

  try {
    const res = await client.query(query, values);
    return res.rows[0];  // Retorna el cliente recién creado
  } catch (error) {
    throw new Error('Error al crear el cliente: ' + error.message);
  }
};

// Función para crear una nueva persona natural
export const crearPersonaNatural = async ({ cliente_id, nombre, dni }) => {
  const query = `
    INSERT INTO personaNatural (cliente_id, nombre, dni)
    VALUES ($1, $2, $3)
    RETURNING cliente_id, nombre, dni;
  `;
  const values = [cliente_id, nombre, dni];

  try {
    const res = await client.query(query, values);
    return res.rows[0];  // Retorna la persona natural recién creada
  } catch (error) {
    throw new Error('Error al crear la persona natural: ' + error.message);
  }
};

// Función para crear una nueva persona jurídica
export const crearPersonaJuridica = async ({
  cliente_id,
  razon_social,
  ruc,
  estado,
  condicion,
  direccion,
  ubigeo,
  via_tipo,
  via_nombre,
  zona_codigo,
  zona_tipo,
  numero,
  distrito,
  provincia,
  departamento
}) => {
  const query = `
    INSERT INTO personaJuridica (cliente_id, razon_social, ruc, estado, condicion, direccion, ubigeo, via_tipo, via_nombre, 
    zona_codigo, zona_tipo, numero, distrito, provincia, departamento)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING cliente_id, razon_social, ruc;
  `;
  const values = [
    cliente_id,
    razon_social,
    ruc,
    estado,
    condicion,
    direccion,
    ubigeo,
    via_tipo,
    via_nombre,
    zona_codigo,
    zona_tipo,
    numero,
    distrito,
    provincia,
    departamento
  ];

  try {
    const res = await client.query(query, values);
    return res.rows[0];  // Retorna la persona jurídica recién creada
  } catch (error) {
    throw new Error('Error al crear la persona jurídica: ' + error.message);
  }
};

// Función para obtener los datos de un cliente por documento (DNI o RUC)
export const obtenerClientePorDocumento = async (documento) => {
  const query = `
    SELECT c.id, c.correo, c.telefono, c.tipo_cliente, p.nombres, p.apellidoPaterno, p.apellidoMaterno, j.razon_social
    FROM cliente c
    LEFT JOIN personaNatural p ON c.id = p.cliente_id
    LEFT JOIN personaJuridica j ON c.id = j.cliente_id
    WHERE c.documento = $1;
  `;
  const values = [documento];

  try {
    const res = await client.query(query, values);
    return res.rows[0];  // Retorna los datos del cliente
  } catch (error) {
    throw new Error('Error al obtener los datos del cliente: ' + error.message);
  }
};

// Modelo Cliente (función de creación base)
export const Cliente = {
  create: registrarCliente
};

// Modelo Persona Natural
export const PersonaNatural = {
  create: crearPersonaNatural
};

// Modelo Persona Jurídica
export const PersonaJuridica = {
  create: crearPersonaJuridica
};



