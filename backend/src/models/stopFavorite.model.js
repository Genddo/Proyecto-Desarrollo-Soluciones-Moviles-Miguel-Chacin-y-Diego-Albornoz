const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StopFavorite = sequelize.define(
  'ParaderoFavorito',
  {
    id_favorito: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    id_paradero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'PARADERO_FAVORITO',
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: [
          'id_usuario',
          'id_paradero',
        ],
      },
    ],
  }
);

module.exports = StopFavorite;