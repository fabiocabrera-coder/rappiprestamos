const { Sequelize } = require('sequelize');

// Conexión a la base de datos
const sequelize = new Sequelize(process.env.DB_URI, {
    dialect: 'postgres',
    logging: false,
});

module.exports = sequelize;
