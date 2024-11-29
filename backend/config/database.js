const { Client } = require('pg');

// Crear la conexión a la base de datos PostgreSQL
const client = new Client({
    host: 'localhost', // Cambiar si tienes una configuración diferente
    port: 5432,
    user: 'tu_usuario',  // Tu usuario de PostgreSQL
    password: 'tu_contraseña',  // Tu contraseña de PostgreSQL
    database: 'nombre_de_tu_base_de_datos',
});

client.connect()
    .then(() => console.log('Conectado a PostgreSQL'))
    .catch((err) => console.error('Error de conexión:', err.stack));

module.exports = client;
