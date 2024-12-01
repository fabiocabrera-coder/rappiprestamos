// config/database.js
import pkg from 'pg';  // Importamos todo el paquete
const { Client } = pkg;  // Desestructuramos para obtener Client

const client = new Client({
  host: 'localhost', 
  port: 5432,
  user: 'postgres',  
  password: 'admin123',  
  database: 'postgres',
});

client.connect()
  .then(() => console.log('Conectado a PostgreSQL'))
  .catch((err) => console.error('Error de conexión:', err.stack));

export { client };  // Exportación con nombre
