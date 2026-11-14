const sequelize = require('../config/database');

const User = require('./user.model');
const Vehicle = require('./vehicle.model');
const Trip = require('./trip.model');
const TripLocation = require('./tripLocation.model');
const TripLink = require('./tripLink.model');
const StopRequest = require('./stopRequest.model');

const Line = require('./line.model');
const Route = require('./route.model');
const Stop = require('./stop.model');
const RouteStop = require('./routeStop.model');

/*
 * =========================================================
 * RELACIONES DEL MÓDULO RED DE TRANSPORTE
 * =========================================================
 */

// Una línea puede tener varios recorridos.
Line.hasMany(Route, {
  foreignKey: 'id_linea',
  as: 'recorridos'
});

Route.belongsTo(Line, {
  foreignKey: 'id_linea',
  as: 'linea'
});

// Un recorrido puede tener varios paraderos ordenados.
Route.hasMany(RouteStop, {
  foreignKey: 'id_recorrido',
  as: 'paraderosRecorrido'
});

RouteStop.belongsTo(Route, {
  foreignKey: 'id_recorrido',
  as: 'recorrido'
});

// Un paradero puede pertenecer a varios recorridos.
Stop.hasMany(RouteStop, {
  foreignKey: 'id_paradero',
  as: 'recorridosParadero'
});

RouteStop.belongsTo(Stop, {
  foreignKey: 'id_paradero',
  as: 'paradero'
});

// Un recorrido puede tener varios viajes.
Route.hasMany(Trip, {
  foreignKey: 'id_recorrido',
  as: 'viajes'
});

Trip.belongsTo(Route, {
  foreignKey: 'id_recorrido',
  as: 'recorrido'
});

// Un vehículo puede realizar varios viajes en distintos momentos.
Vehicle.hasMany(Trip, {
  foreignKey: 'id_vehiculo',
  as: 'viajes'
});

Trip.belongsTo(Vehicle, {
  foreignKey: 'id_vehiculo',
  as: 'vehiculo'
});

/*
 * =========================================================
 * RELACIONES DE VIAJES, UBICACIÓN Y PASAJEROS
 * =========================================================
 */

Trip.hasMany(TripLocation, {
  foreignKey: 'id_viaje'
});

TripLocation.belongsTo(Trip, {
  foreignKey: 'id_viaje'
});

Trip.hasMany(TripLink, {
  foreignKey: 'id_viaje'
});

TripLink.belongsTo(Trip, {
  foreignKey: 'id_viaje'
});

User.hasMany(TripLink, {
  foreignKey: 'id_usuario'
});

TripLink.belongsTo(User, {
  foreignKey: 'id_usuario'
});

TripLink.hasMany(StopRequest, {
  foreignKey: 'id_vinculacion'
});

StopRequest.belongsTo(TripLink, {
  foreignKey: 'id_vinculacion'
});

Stop.hasMany(StopRequest, {
  foreignKey: 'id_paradero'
});

StopRequest.belongsTo(Stop, {
  foreignKey: 'id_paradero'
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
  Route,
  Stop,
  RouteStop
};