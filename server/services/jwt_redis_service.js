'use strict';

const _            = require('lodash');
const Bluebird     = require('bluebird');
const util         = require('util');
const uuid         = require('node-uuid');
const jwt          = require('jsonwebtoken');
const redis        = require('redis');

const SECOND = 1000;

function JWTRedisServiceError(message) {
  Error.call(this);
  this.name    = 'JWTRedisServiceError';
  this.message = message;
}

function UnauthorizedAccessError(message) {
  Error.call(this);
  this.name    = 'UnauthorizedAccessError';
  this.message = message || 'Token verification failed. Admin not authenticated or token expired.';
}

function NoTokenProvidedError(message) {
  Error.call(this);
  this.name    = 'NoTokenProvidedError';
  this.message = message || 'No token provided.';
}

util.inherits(JWTRedisServiceError,    Error);
util.inherits(UnauthorizedAccessError, Error);
util.inherits(NoTokenProvidedError,    Error);

function JWTRedisService(config) {
  this.client = redis.createClient(config.connection);

  this.issuer     = config.issuer;
  this.secret     = config.secret;
  this.keyspace   = config.keyspace;
  this.expiration = config.expiration;
}

JWTRedisService.prototype.connect = function() {
  return this.client.connect();
}

JWTRedisService.prototype.sign = function(data) {
  const jti = uuid.v4();

  const token = jwt.sign({ jti }, this.secret, {
    issuer    : this.issuer,
    expiresIn : this.expiration / SECOND
  });

  return this.client.PSETEX(this.keyspace + jti, this.expiration, JSON.stringify(data))
  .then((reply) => {
    if (!reply) {
      throw new JWTRedisServiceError('Session could not be stored in Redis');
    }

    return token;
  });
};

JWTRedisService.prototype.verify = function(token) {
  if (_.isEmpty(token)) {
    return Bluebird.reject(new NoTokenProvidedError());
  }

  return jwt.verifyAsync(token, this.secret)
  .catch(() => {
    throw new UnauthorizedAccessError();
  })
  .then((decoded) => {
    if (_.isEmpty(decoded.jti)) {
      throw new UnauthorizedAccessError();
    }
    return this.client.GET(this.keyspace + decoded.jti)
    .then((data) => {
      if (_.isEmpty(data)) {
        throw new UnauthorizedAccessError();
      }

      return [ decoded.jti, data ];
    });
  });
};

JWTRedisService.prototype.expire = function(token) {
  if (_.isEmpty(token)) {
    return Bluebird.resolve();
  }

  const data = jwt.decode(token, this.secret);

  if (_.isEmpty(data) || _.isEmpty(data.jti)) {
    return Bluebird.resolve();
  }

  return this.client.DEL(this.keyspace + data.jti);
};

JWTRedisService.JWTRedisServiceError    = JWTRedisServiceError;
JWTRedisService.UnauthorizedAccessError = UnauthorizedAccessError;
JWTRedisService.NoTokenProvidedError    = NoTokenProvidedError;

module.exports = JWTRedisService;
