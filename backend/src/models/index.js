const sequelize = require('../config/database');
const User = require('./user.model');
const Vehicle = require('./vehicle.model');
const Trip = require('./trip.model');
const TripLocation = require('./tripLocation.model');
const TripLink = require('./tripLink.model');
const StopRequest = require('./stopRequest.model');
const Line = require('./line.model');
const Stop = require('./stop.model');
const Route = require('./route.model');

// Relaciones de la Red de Transporte
Line.hasMany(Route, { foreignKey: 'id_linea' });
Route.belongsTo(Line, { foreignKey: 'id_linea' });

Route.hasMany(Trip, { foreignKey: 'id_recorrido' });
Trip.belongsTo(Route, { foreignKey: 'id_recorrido' });

// Relaciones principales de Viajes, Ubicación y Pasajeros
Trip.hasMany(TripLocation, { foreignKey: 'id_viaje' });
TripLocation.belongsTo(Trip, { foreignKey: 'id_viaje' });

Trip.hasMany(TripLink, { foreignKey: 'id_viaje' });
TripLink.belongsTo(Trip, { foreignKey: 'id_viaje' });

User.hasMany(TripLink, { foreignKey: 'id_usuario' });
TripLink.belongsTo(User, { foreignKey: 'id_usuario' });

TripLink.hasMany(StopRequest, { foreignKey: 'id_vinculacion' });
StopRequest.belongsTo(TripLink, { foreignKey: 'id_vinculacion' });

Stop.hasMany(StopRequest, { foreignKey: 'id_paradero' });
StopRequest.belongsTo(Stop, { foreignKey: 'id_paradero' });

module.exports = {
  sequelize,
  User,
  Vehicle,
  Trip,
  TripLocation,
  TripLink,
  StopRequest,
  Line,
  Stop,
  Route
};