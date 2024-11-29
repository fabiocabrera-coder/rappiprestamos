// authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Admin } = require('../models/admin'); // Asumiendo que tienes un modelo Admin en tu base de datos

// Autenticación de administrador
async function login(credentials) {
    const { email, password } = credentials;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
        throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token };
}

// Logout (puedes implementar una lógica más compleja si necesitas invalidar el token)
function logout() {
    return { message: 'Cerrando sesión' };
}

module.exports = { login, logout };
