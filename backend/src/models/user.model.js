const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombre: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  correo: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },

  telefono: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },

  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  rol: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'pasajero'
  },

  estado: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'activo'
  },

  intentos_fallidos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  bloqueado_hasta: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'USUARIO',
  timestamps: false
});

module.exports = User;