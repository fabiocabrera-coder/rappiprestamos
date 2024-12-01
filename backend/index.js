import express from 'express';  // Usar import para cargar express
import { router as clienteRoutes } from './routes/clienteRoutes.js';  // Cambia a importar la exportación explícita
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Para parsear las solicitudes con JSON

// Rutas
app.use('/api/clientes', clienteRoutes);  // Ahora clienteRoutes ya debería funcionar correctamente

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});


