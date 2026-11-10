const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stop = sequelize.define('Paradero', {
  id_paradero: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  codigo: { type: DataTypes.TEXT, allowNullable: false, unique: true },
  nombre: { type: DataTypes.TEXT, allowNullable: false },
  latitud: { type: DataTypes.REAL, allowNullable: false },
  longitud: { type: DataTypes.REAL, allowNullable: false },
  activo: { type: DataTypes.INTEGER, defaultValue: 1 }
}, { tableName: 'PARADERO', timestamps: false });

module.exports = Stop;