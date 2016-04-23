'use strict';

const config       = require('config');
const express      = require('express');
const fs           = require('fs');
const RouteUtils   = require('../utils/route_utils');
const api          = require('../api');
const streamRouter = require('../routes/stream');

const enforceSSL = RouteUtils.enforceSSL({ port: config.server.ssl.port });

function serveBundledView(view, page, enableGoogleAnalytics, bundleMappingsPath) {
  return function(req, res, next) {
    const googleAnalytics = config.googleAnalytics && enableGoogleAnalytics ? {
      debug         : config.env !== config.environments.production,
      trackingId    : config.googleAnalytics.trackingId,
      cookieOptions : config.googleAnalytics.cookieOptions
    } : null;

    fs.readFileAsync(bundleMappingsPath)
    .then(JSON.parse)
    .then(function(mappings) {
      res.render(view, {
        settings : config.app[page],
        scripts  : {
          commons : mappings.commons.js,
          app     : mappings[page].js
        },
        googleAnalytics
      });
    })
    .catch(next);
  };
}

module.exports = function(app) {

  // Secured content
  app.use(config.app.dashboard.base, enforceSSL);
  app.use(config.app.redeem.base,    enforceSSL);

  // Serve assets
  app.use('/', express.static(config.app.assets.path, {
    etag   : true,
    maxage : config.app.assets.maxAge,
    index  : false
  }));

  // app.use('/web',       serveBundledView('index', 'web',       config.app.assets.mappings));
  app.use('/dashboard', serveBundledView('index', 'dashboard', false, config.app.assets.mappings));
  app.use('/redeem',    serveBundledView('index', 'redeem',    true, config.app.assets.mappings));

  // URL rewrite for non-HTML5 browsers
  // Just send the index.html for other files to support HTML5Mode
  // app.all(config.app.dashboard.base + '*', function(req, res, next) {
  //   res.sendFile(config.app.dashboard.index, { root: path.join(__dirname, config.app.dashboard.root) });
  // });

  // app.all(config.app.web.base + '*', function(req, res, next) {
  //   res.sendFile(config.app.web.index, { root: path.join(__dirname, config.app.web.root) });
  // });

  // Routes
  app.use('/stream', streamRouter());

  // API
  app.use(config.app.api.base, api());

};
