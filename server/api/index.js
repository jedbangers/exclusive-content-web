/* eslint no-unused-vars: [2, { "args": "none" }] */
'use strict';

const config          = require('config');
const express         = require('express');
const Response        = require('simple-response');
const BadRequestError = require('passport-local-mongoose/lib/badrequesterror');
const ValidationError = require('mongoose/lib/error/validation');
const CastError       = require('mongoose/lib/error/cast');
const RouteUtils      = require('../utils/route_utils');
const Middlewares     = require('../middlewares');

module.exports = function() {

  const api = express();

  api.use(RouteUtils.enforceSSL({ port: config.server.ssl.port }));

  api.use('/settings', require('./settings'));
  api.use('/auth',     require('./auth'));
  api.use('/admins',   Middlewares.Auth.ensureAuthenticated(), require('./admins'));

  api.use(RouteUtils.handleError(RouteUtils.InvalidIdError, (err, req, res, next) => {
    Response.BadRequest(res)(err);
  }));

  api.use(RouteUtils.handleError(RouteUtils.DocumentNotFoundError, (err, req, res, next) => {
    Response.NotFound(res)(err);
  }));

  api.use(RouteUtils.handleError(RouteUtils.ForbiddenError, (err, req, res, next) => {
    Response.Forbidden(res)(err);
  }));

  api.use(RouteUtils.handleError(BadRequestError, (err, req, res, next) => {
    Response.BadRequest(res)(err);
  }));

  api.use(RouteUtils.handleError(ValidationError, (err, req, res, next) => {
    Response.BadRequest(res)(err);
  }));

  api.use(RouteUtils.handleError(CastError, (err, req, res, next) => {
    Response.BadRequest(res)(err);
  }));

  // Default error handler
  api.use((err, req, res, next) => {
    Response.InternalServerError(res)(err);
  });

  return api;

};
