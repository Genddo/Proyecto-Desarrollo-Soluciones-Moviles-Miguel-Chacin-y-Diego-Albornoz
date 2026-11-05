const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehiculo', {
  id_vehiculo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  identificador: { type: DataTypes.TEXT, allowNullable: false, unique: true }, // Código o QR del bus
  patente: { type: DataTypes.TEXT, allowNullable: false },
  capacidad: { type: DataTypes.INTEGER },
  estado_operativo: { type: DataTypes.TEXT, defaultValue: 'operativo' }
}, { tableName: 'VEHICULO', timestamps: false });

module.exports = Vehicle;