'use strict';

const config     = require('config');
const express    = require('express');
const fs         = require('fs');
const superagent = require('superagent');
const RouteUtils = require('../utils/route_utils');
const api        = require('../api');

const enforceSSL = RouteUtils.enforceSSL({ port: config.server.ssl.port });

function serveBundledView(view, page, bundleMappingsPath) {
  return function(req, res, next) {
    fs.readFileAsync(bundleMappingsPath)
    .then(JSON.parse)
    .then(function(mappings) {
      res.render(view, {
        settings : config.app[page],
        scripts  : {
          commons : mappings.commons.js,
          app     : mappings[page].js
        }
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
  app.use('/dashboard', serveBundledView('index', 'dashboard', config.app.assets.mappings));
  app.use('/redeem',    serveBundledView('index', 'redeem',    config.app.assets.mappings));

  app.use('/streamContent/:code', (req, res) => {
    superagent.get('http://dl.dropbox.com/u/1538714/article_resources/song.m4a').pipe(res);
  });

  // URL rewrite for non-HTML5 browsers
  // Just send the index.html for other files to support HTML5Mode
  // app.all(config.app.dashboard.base + '*', function(req, res, next) {
  //   res.sendFile(config.app.dashboard.index, { root: path.join(__dirname, config.app.dashboard.root) });
  // });

  // app.all(config.app.web.base + '*', function(req, res, next) {
  //   res.sendFile(config.app.web.index, { root: path.join(__dirname, config.app.web.root) });
  // });

  // API
  app.use(config.app.api.base, api());

};
