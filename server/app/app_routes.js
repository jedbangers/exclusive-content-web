'use strict';

const Bluebird              = require('bluebird');
const config                = require('config');
const express               = require('express');
const fs                    = require('fs');
const RouteUtils            = require('../utils/route_utils');
const api                   = require('../api');
const streamRouter          = require('../routes/stream');
const Settings              = require('../settings');
const generalSettingService = require('../services/general_settings_service');

const enforceSSL = RouteUtils.enforceSSL({ port: config.server.ssl.port });

function serveBundledView(view, pageName, enableGoogleAnalytics, bundleMappingsPath) {
  return function(req, res, next) {
    const googleAnalytics = config.googleAnalytics && enableGoogleAnalytics ? {
      debug         : config.env !== config.environments.production,
      trackingId    : config.googleAnalytics.trackingId,
      cookieOptions : config.googleAnalytics.cookieOptions
    } : null;

    Bluebird.all([
      fs.readFileAsync(bundleMappingsPath).then(JSON.parse),
      generalSettingService.getSettings()
    ])
    .spread(function(mappings, generalSettings) {
      let page = null;
      if (config.app[pageName]) {
        page = {};
        page.base  = config.app[pageName].base;
        page.title = config.app[pageName].title;
        page.scripts = {
          commons : mappings.commons.js,
          app     : mappings[pageName].js
        };
      }
      res.render(view, {
        page,
        googleAnalytics,
        settings: Settings,
        generalSettings
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

  app.use('/redeem', serveBundledView('index', 'redeem', true, config.app.assets.mappings));
  app.use('/dashboard', serveBundledView('index', 'dashboard', false, config.app.assets.mappings));

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
