const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Line = sequelize.define('Linea', {
  id_linea: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  codigo: { type: DataTypes.TEXT, allowNullable: false, unique: true },
  nombre: { type: DataTypes.TEXT, allowNullable: false },
  color: { type: DataTypes.TEXT },
  estado: { type: DataTypes.TEXT, defaultValue: 'activo' } // 'activo', 'suspendido', 'desactivado'
}, { tableName: 'LINEA', timestamps: false });

module.exports = Line;