'use strict';

const Environments = require('./environments');

module.exports = {
  env: Environments.development,
  app: {
    assets: {
      maxAge: 0
    },
    web: {
      root: '../../.tmp' // TODO review when reviewing HTML5 support
    },
    dashboard: {
      root: '../../.tmp' // TODO review when reviewing HTML5 support
    }
  },
  server: {
    logs: true,
    ssl: {
      port: 3001
    },
    auth: {
      tokenSecret: 'mercyfulfate'
    }
  },
  mongo: {
    uri: 'mongodb://localhost/jedbangers_exclusive_content_dev'
  },
  googleAnalytics: {
    trackingId: 'UA-76570826-1',
    cookieOptions: {
      cookieDomain: 'none'
    }
  }
};
