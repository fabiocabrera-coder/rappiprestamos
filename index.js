import path from "path";
import { fileURLToPath } from 'url';

import express from 'express';  // Usar import para cargar express
import { router as clienteRoutes } from './routes/clienteRoutes.js';  // Cambia a importar la exportación explícita
import prestamoRoutes from './routes/prestamoRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Para parsear las solicitudes con JSON
app.use(express.static(path.join(__dirname, '../frontend/html')));
// Rutas
app.use('/pagina-principal', publicRoutes);
app.use('/api/clientes', clienteRoutes);  
app.use('/api/prestamos', prestamoRoutes);
app.use('/api/pagos', pagoRoutes);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});