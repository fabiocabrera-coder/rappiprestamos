import client from '../config/database.js';  // Importación con la exportación nombrada

// Definimos las funciones para interactuar con la base de datos

// Función para crear un nuevo cliente
export const registrarCliente = async ({ correo, telefono, tipoCliente, documento}) => {
  const query = `
    INSERT INTO cliente (correo, telefono, tipo_cliente, documento)
    VALUES ($1, $2, $3, $4)
    RETURNING id, correo, telefono, tipo_cliente, documento;
  `;
  const values = [correo, telefono, tipoCliente, documento];

  try {
    const res = await client.query(query, values);
    return res.rows[0];  // Retorna el cliente recién creado
  } catch (error) {
    throw new Error('Error al crear el cliente: ' + error.message);
  }
};

// Función para crear una nueva persona natural
export const crearPersonaNatural = async ({ cliente_id, nombres, dni, apellidopaterno, apellidomaterno, tipodocumento, digitoverificador }) => {

  const query = `
    INSERT INTO personanatural ( cliente_id, nombres, dni, apellidopaterno, apellidomaterno, tipodocumento, digitoverificador)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING cliente_id, nombres, dni, apellidopaterno, apellidomaterno, tipodocumento, digitoverificador;
  `;
  const values = [ cliente_id, nombres, dni, apellidopaterno, apellidomaterno, tipodocumento, digitoverificador ];

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
    interior,
    lote,
    dpto,
    manzana,
    kilometro,
    distrito,
    provincia,
    departamento,
    esagenteretencion,
    tipo,
    actividadeconomica,
    numerotrabajadores,
    tipofacturacion,
    tipocontabilidad,
    comercioexterior
}) => {
  const query = `
    INSERT INTO personajuridica (cliente_id, razon_social, ruc, estado, condicion, direccion, ubigeo, via_tipo, via_nombre, 
    zona_codigo, zona_tipo, numero, interior, lote, dpto, manzana, kilometro, distrito, provincia, departamento, esagenteretencion, tipo, actividadeconomica, numerotrabajadores, tipofacturacion, tipocontabilidad, comercioexterior)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
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
    interior,
    lote,
    dpto,
    manzana,
    kilometro,
    distrito,
    provincia,
    departamento,
    esagenteretencion,
    tipo,
    actividadeconomica,
    numerotrabajadores,
    tipofacturacion,
    tipocontabilidad,
    comercioexterior
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

// Función para verificar si el correo ya existe
export const obtenerClientePorCorreo = async (correo) => {
    const query = `
      SELECT id FROM cliente WHERE correo = $1;
    `;
    const values = [correo];
  
    try {
      const res = await client.query(query, values);
      return res.rows[0]; // Retorna el cliente si existe
    } catch (error) {
      throw new Error('Error al verificar el correo: ' + error.message);
    }
  };
  

// Modelo Cliente (función de creación base)
export const Cliente = {
  create: registrarCliente,
  obtenerClientePorCorreo: obtenerClientePorCorreo
};

// Modelo Persona Natural
export const PersonaNatural = {
  create: crearPersonaNatural
};

// Modelo Persona Jurídica
export const PersonaJuridica = {
  create: crearPersonaJuridica
};



