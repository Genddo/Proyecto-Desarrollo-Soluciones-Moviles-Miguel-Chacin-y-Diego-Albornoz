const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StopRequest = sequelize.define('SolicitudParada', {
  id_solicitud: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_vinculacion: { type: DataTypes.INTEGER, allowNullable: false },
  id_paradero: { type: DataTypes.INTEGER, allowNullable: false },
  fecha_hora: { type: DataTypes.TEXT, allowNullable: false },
  estado: { type: DataTypes.TEXT, defaultValue: 'enviada' }, // 'enviada', 'proxima', 'cerrada'
  motivo_cierre: { type: DataTypes.TEXT }
}, { tableName: 'SOLICITUD_PARADA', timestamps: false });

module.exports = StopRequest;