const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TripLink = sequelize.define('VinculacionViaje', {
  id_vinculacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_viaje: { type: DataTypes.INTEGER, allowNullable: false },
  id_usuario: { type: DataTypes.INTEGER, allowNullable: true }, // Nulo para usuarios invitados
  fecha_hora_inicio: { type: DataTypes.TEXT, allowNullable: false },
  fecha_hora_fin: { type: DataTypes.TEXT },
  metodo_vinculacion: { type: DataTypes.TEXT, defaultValue: 'QR' }, // 'QR' o 'MANUAL'
  activa: { type: DataTypes.INTEGER, defaultValue: 1 } // 1 = activa, 0 = finalizada
}, { tableName: 'VINCULACION_VIAJE', timestamps: false });

module.exports = TripLink;