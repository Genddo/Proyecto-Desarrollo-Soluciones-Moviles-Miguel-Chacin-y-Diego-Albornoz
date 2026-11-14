const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trip = sequelize.define('Viaje', {
  id_viaje: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_turno: {
    type: DataTypes.INTEGER
  },

  id_recorrido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  id_vehiculo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  orden: {
    type: DataTypes.INTEGER
  },

  hora_inicio_real: {
    type: DataTypes.TEXT
  },

  hora_fin_real: {
    type: DataTypes.TEXT
  },

  estado: {
    type: DataTypes.TEXT,
    defaultValue: 'planificado'
  },

  ultima_latitud: {
    type: DataTypes.REAL
  },

  ultima_longitud: {
    type: DataTypes.REAL
  },

  fecha_ultima_ubicacion: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'VIAJE',
  timestamps: false
});

module.exports = Trip;