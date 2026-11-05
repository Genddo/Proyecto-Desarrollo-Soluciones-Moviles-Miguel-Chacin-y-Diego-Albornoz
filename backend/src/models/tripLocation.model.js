const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TripLocation = sequelize.define('UbicacionViaje', {
  id_ubicacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_viaje: { type: DataTypes.INTEGER, allowNullable: false },
  latitud: { type: DataTypes.REAL, allowNullable: false },
  longitud: { type: DataTypes.REAL, allowNullable: false },
  fecha_hora: { type: DataTypes.TEXT, allowNullable: false }
}, { tableName: 'UBICACION_VIAJE', timestamps: false });

module.exports = TripLocation;