import { Router } from "express";
import path from "path";
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../../frontend/html');

router.get('/pagina-principal', (req, res) => {
    res.sendFile(path.join(publicPath, "pagPrincipal.html"));
});

router.get('/admin', (req, res) => {
    res.sendFile(path.join(publicPath, "admin.html"));
});

router.get('/detalle-prestamo', (req, res) => {
    res.sendFile(path.join(publicPath, "detailsPresta.html"));
});

router.get('/deuda-judicial', (req, res) => {
    res.sendFile(path.join(publicPath, "deudaJud.html"));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(publicPath, "login.html"));
});

router.get('/mora', (req, res) => {
    res.sendFile(path.join(publicPath, "mora.html"));
});

router.get('/lista-pagos', (req, res) => {
    res.sendFile(path.join(publicPath, "payList.html"));
});

router.get('/registrar-cliente', (req, res) => {
    res.sendFile(path.join(publicPath, "registerClient.html"));
});

export default router;