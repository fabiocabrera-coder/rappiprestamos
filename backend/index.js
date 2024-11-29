// Importar las dependencias necesarias
import express from 'express';  // Importar Express
import cors from 'cors';         // Si estás usando CORS

// Crear una instancia de la aplicación Express
const app = express();

// Configuración de middlewares
app.use(cors());               // Habilitar CORS
app.use(express.json());       // Permite que el servidor entienda JSON en las peticiones

// Definir una ruta básica para probar
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');    // Responde con un mensaje básico
});

// Configurar el puerto donde corre el servidor
const PORT = process.env.PORT || 3000;  // Si no hay una variable de entorno, usa el puerto 3000

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
