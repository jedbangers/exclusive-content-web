'use strict';

const config       = require('config');
const cookieParser = require('cookie-parser');
const passport     = require('passport');
const morgan       = require('morgan');
const compression  = require('compression');
const bodyparser   = require('body-parser');
const Middlewares  = require('../middlewares');
const User         = require('../model/user');

module.exports = function(app) {

  passport.use(User.createStrategy());

  app.enable('trust proxy');

  app.set('view engine', 'jade');
  app.set("views", config.app.views.path);

  if (config.env !== config.environments.test) {
    app.use(morgan('dev'));
  }

  app.use(compression());
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());

  // httpOnly : true,
  // secure   : true,
  // path     : '/',
  // maxAge   : 1000 * 60 * 24 // 24 hours
  app.use(cookieParser({}));

  app.use(passport.initialize());

  app.use(Middlewares.TokenExtractor);

};
