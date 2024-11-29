const jwt = require('jsonwebtoken');

// Middleware para verificar autenticación
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Agregar el usuario decodificado a la solicitud
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token no válido' });
    }
};

module.exports = authMiddleware;
