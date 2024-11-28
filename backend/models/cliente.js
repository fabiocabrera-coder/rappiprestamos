const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    RUC: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = { Cliente };
