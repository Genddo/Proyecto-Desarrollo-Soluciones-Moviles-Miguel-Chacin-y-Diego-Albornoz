const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RouteStop = sequelize.define('RecorridoParadero', {
  id_recorrido_paradero: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_recorrido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  id_paradero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  orden: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'RECORRIDO_PARADERO',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['id_recorrido', 'id_paradero']
    },
    {
      unique: true,
      fields: ['id_recorrido', 'orden']
    }
  ]
});

module.exports = RouteStop;