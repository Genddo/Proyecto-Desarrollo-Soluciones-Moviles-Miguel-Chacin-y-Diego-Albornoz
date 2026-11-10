const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Route = sequelize.define('Recorrido', {
  id_recorrido: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_linea: { type: DataTypes.INTEGER, allowNullable: false },
  sentido: { type: DataTypes.TEXT, allowNullable: false }, // 'Ida' o 'Vuelta'
  dias_funcionamiento: { type: DataTypes.TEXT },
  hora_inicio: { type: DataTypes.TEXT },
  hora_fin: { type: DataTypes.TEXT },
  activo: { type: DataTypes.INTEGER, defaultValue: 1 }
}, { tableName: 'RECORRIDO', timestamps: false });

module.exports = Route;