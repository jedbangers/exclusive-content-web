'use strict';

const config          = require('config');
const cookieParser    = require('cookie-parser');
const passport        = require('passport');
const morgan          = require('morgan');
const compression     = require('compression');
const bodyparser      = require('body-parser');
const favicon         = require('serve-favicon');
const helmet          = require('helmet');
const Middlewares     = require('../middlewares');
const Admin           = require('../model/admin');
const JWTRedisService = require('../services/jwt_redis_service');

module.exports = function(app) {

  passport.use(Admin.createStrategy());

  app.enable('trust proxy');

  app.set('view engine', 'jade');
  app.set("views", config.app.views.path);

  app.set('jwtRedisService', new JWTRedisService({
    connection : config.redis.connection,
    issuer     : config.server.auth.issues,
    secret     : config.server.auth.tokenSecret,
    expiration : config.server.auth.expiration
  }));

  if (config.env !== config.environments.test) {
    app.use(morgan('dev'));
  }

  app.use(compression());
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(Middlewares.TokenExtractor);

  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());
  app.use(helmet.contentSecurityPolicy({
    defaultSrc : [ "'self'" ],
    scriptSrc  : [
      "'unsafe-inline'",
      "'self'",
      "'unsafe-eval'",
      '*.google.com',
      '*.gstatic.com',
      '*.google-analytics.com'
    ],
    styleSrc   : [ "'unsafe-inline'", "'self'", '*.fonts.googleapis.com' ],
    imgSrc     : [ '*' ], // "'self'", '*.google.com', '*.cloudinary.com'
    connectSrc : [ "'self'" ],
    fontSrc    : [ "'self'", '*.fonts.gstatic.com' ],
    objectSrc  : [ "'self'" ],
    mediaSrc   : [ "'self'" ],
    frameSrc   : [ "'self'", '*.vimeo.com', '*.youtube.com', '*.dailymotion.com' ]
  }));

  if (config.app.favicon) {
    app.use(favicon(config.app.favicon));
  } else {
    app.use('/favicon.ico', function(req, res) {
      res.type('image/x-icon');
      res.status(200).end();
    });
  }

};
