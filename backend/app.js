const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const clienteRoutes = require('./routes/clienteRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Cargar variables de entorno
dotenv.config();

// Inicializar aplicación
const app = express();
app.use(express.json()); // Para analizar JSON en el cuerpo de las solicitudes

// Usar las rutas
app.use('/api/clientes', clienteRoutes);
app.use(errorHandler);

// Conectar a la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos exitosa');
    })
    .catch((error) => {
        console.error('No se pudo conectar a la base de datos:', error);
    });

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${3000}`);
});


