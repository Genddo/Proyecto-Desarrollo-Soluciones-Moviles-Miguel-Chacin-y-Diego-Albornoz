const sequelize = require('../config/database');
const User = require('./user.model');
const Vehicle = require('./vehicle.model');
const Trip = require('./trip.model');
const TripLocation = require('./tripLocation.model');
const TripLink = require('./tripLink.model');
const StopRequest = require('./stopRequest.model');

// Relaciones principales
Trip.hasMany(TripLocation, { foreignKey: 'id_viaje' });
TripLocation.belongsTo(Trip, { foreignKey: 'id_viaje' });

Trip.hasMany(TripLink, { foreignKey: 'id_viaje' });
TripLink.belongsTo(Trip, { foreignKey: 'id_viaje' });

User.hasMany(TripLink, { foreignKey: 'id_usuario' });
TripLink.belongsTo(User, { foreignKey: 'id_usuario' });

TripLink.hasMany(StopRequest, { foreignKey: 'id_vinculacion' });
StopRequest.belongsTo(TripLink, { foreignKey: 'id_vinculacion' });

module.exports = {
  sequelize,
  User,
  Vehicle,
  Trip,
  TripLocation,
  TripLink,
  StopRequest
};