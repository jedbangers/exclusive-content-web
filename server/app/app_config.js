'use strict';

const config       = require('config');
const cookieParser = require('cookie-parser');
const passport     = require('passport');
const morgan       = require('morgan');
const compression  = require('compression');
const bodyparser   = require('body-parser');
const favicon      = require('serve-favicon');
const Middlewares  = require('../middlewares');
const Admin        = require('../model/admin');

module.exports = function(app) {

  passport.use(Admin.createStrategy());

  app.enable('trust proxy');

  app.set('view engine', 'jade');
  app.set("views", config.app.views.path);

  if (config.env !== config.environments.test) {
    app.use(morgan('dev'));
  }

  app.use(compression());
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(Middlewares.TokenExtractor);

  if (config.app.favicon) {
    app.use(favicon(config.app.favicon));
  } else {
    app.use('/favicon.ico', function(req, res) {
      res.type('image/x-icon');
      res.status(200).end();
    });
  }

};
