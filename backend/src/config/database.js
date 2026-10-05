const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración de Sequelize para SQLite local
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database/voybus.sqlite'),
  logging: false
});

module.exports = sequelize;