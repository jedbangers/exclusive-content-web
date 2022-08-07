'use strict';

const config          = require('config');
const passport        = require('passport');
const Response        = require('simple-response');
const JWTRedisService = require('../services/jwt_redis_service');

module.exports = {

  ensureAuthenticated() {
    return (req, res, next) => {
      const token = req.cookies[config.server.auth.cookieName];
      return req.app.get('jwtRedisService').verify(token)
      .spread((jti, user) => {
        req.auth = {
          jti,
          user: JSON.parse(user)
        };
        next();
      })
      .catch(JWTRedisService.NoTokenProvidedError, JWTRedisService.UnauthorizedAccessError, Response.Unauthorized(res))
      .catch(Response.InternalServerError(res));

    };
  },

  authenticate() {
    return (req, res, next) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          return Response.InternalServerError(res)(err);
        }

        if (!user) {
          return Response.Unauthorized(res)(info);
        }

        req.login(user, { session: false }, err2 => {
          if (err2) {
            return Response.InternalServerError(res)(err2);
          }

          next();

        });

      })(req, res, next);
    };
  },

  login() {
    return (req, res) => {
      const user = req.user.toJSON();
      return req.app.get('jwtRedisService').sign(user)
      .then((token) => {
        res.cookie(config.server.auth.cookieName, token, {
          httpOnly : true,
          secure   : true,
          path     : '/',
          maxAge   : 1000 * 60 * 24 // 24 hours
        });
        Response.Ok(res)('Authentication successful.');
      })
      .catch(Response.InternalServerError(res));
    };
  },

  logout() {
    return (req, res) => {
      const token = req.cookies[config.server.auth.cookieName];
      if (!token) {
        return Response.NoContent(res)();
      }

      return req.app.get('jwtRedisService').expire(token)
      .then(() => {
        res.clearCookie(config.server.auth.cookieName);
        Response.Ok(res)('Sucessfully signed out.');
      })
      .catch(Response.InternalServerError(res));

    };
  }

};
