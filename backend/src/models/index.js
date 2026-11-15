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
const RouteStop = require('./routeStop.model');

const StopFavorite = require('./stopFavorite.model');

// =====================================================
// RED DE TRANSPORTE
// =====================================================

// Una línea posee varios recorridos.
Line.hasMany(Route, {
  foreignKey: 'id_linea',
  as: 'recorridos',
});

Route.belongsTo(Line, {
  foreignKey: 'id_linea',
  as: 'linea',
});

// Un recorrido posee paraderos ordenados.
Route.hasMany(RouteStop, {
  foreignKey: 'id_recorrido',
  as: 'paraderosRecorrido',
});

RouteStop.belongsTo(Route, {
  foreignKey: 'id_recorrido',
  as: 'recorrido',
});

// Un paradero puede pertenecer a varios recorridos.
Stop.hasMany(RouteStop, {
  foreignKey: 'id_paradero',
  as: 'recorridosParadero',
});

RouteStop.belongsTo(Stop, {
  foreignKey: 'id_paradero',
  as: 'paradero',
});

// =====================================================
// VIAJES Y VEHÍCULOS
// =====================================================

Route.hasMany(Trip, {
  foreignKey: 'id_recorrido',
  as: 'viajes',
});

Trip.belongsTo(Route, {
  foreignKey: 'id_recorrido',
  as: 'recorrido',
});

Vehicle.hasMany(Trip, {
  foreignKey: 'id_vehiculo',
  as: 'viajes',
});

Trip.belongsTo(Vehicle, {
  foreignKey: 'id_vehiculo',
  as: 'vehiculo',
});

// =====================================================
// UBICACIÓN Y VINCULACIÓN DE PASAJEROS
// =====================================================

Trip.hasMany(TripLocation, {
  foreignKey: 'id_viaje',
});

TripLocation.belongsTo(Trip, {
  foreignKey: 'id_viaje',
});

Trip.hasMany(TripLink, {
  foreignKey: 'id_viaje',
});

TripLink.belongsTo(Trip, {
  foreignKey: 'id_viaje',
});

User.hasMany(TripLink, {
  foreignKey: 'id_usuario',
});

TripLink.belongsTo(User, {
  foreignKey: 'id_usuario',
});

TripLink.hasMany(StopRequest, {
  foreignKey: 'id_vinculacion',
});

StopRequest.belongsTo(TripLink, {
  foreignKey: 'id_vinculacion',
});

Stop.hasMany(StopRequest, {
  foreignKey: 'id_paradero',
});

StopRequest.belongsTo(Stop, {
  foreignKey: 'id_paradero',
});

// =====================================================
// PARADEROS FAVORITOS
// =====================================================

// Un usuario puede guardar varios paraderos favoritos.
User.hasMany(StopFavorite, {
  foreignKey: 'id_usuario',
  as: 'paraderosFavoritos',
});

StopFavorite.belongsTo(User, {
  foreignKey: 'id_usuario',
  as: 'usuario',
});

// Un paradero puede ser favorito de varios usuarios.
Stop.hasMany(StopFavorite, {
  foreignKey: 'id_paradero',
  as: 'favoritos',
});

StopFavorite.belongsTo(Stop, {
  foreignKey: 'id_paradero',
  as: 'paradero',
});

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
  Route,
  RouteStop,

  StopFavorite,
};