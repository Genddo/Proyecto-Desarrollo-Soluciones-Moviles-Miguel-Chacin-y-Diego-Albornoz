const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('Usuario', {
  id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.TEXT, allowNullable: false },
  correo: { type: DataTypes.TEXT, allowNullable: false, unique: true },
  telefono: { type: DataTypes.TEXT },
  password_hash: { type: DataTypes.TEXT },
  rol: { type: DataTypes.TEXT, defaultValue: 'pasajero' }, // 'pasajero', 'conductor', 'admin'
  estado: { type: DataTypes.TEXT, defaultValue: 'activo' }
}, { tableName: 'USUARIO', timestamps: false });

module.exports = User;