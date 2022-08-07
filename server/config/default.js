'use strict';

const url          = require('url');
const path         = require('path');
const Environments = require('./environments');

const aYear = 31556952000;
const projectRoot = path.normalize(path.join(__dirname, '../../'));

module.exports = {
  environments: Environments,
  root: projectRoot,
  app: {
    favicon: path.join(projectRoot, './server/assets/favicon.ico'),
    assets: {
      path     : path.join(projectRoot, './bundle'),
      mappings : path.join(projectRoot, './bundle/webpack-assets.json'),
      maxAge   : aYear
    },
    views: {
      path: path.join(projectRoot, './server/views')
    },
    dashboard: {
      title  : 'Dashboard',
      root   : '../../assets', // TODO review when reviewing HTML5 support
      index  : 'dashboard.html',
      base   : '/dashboard/'
    },
    web: {
      title  : 'Web',
      root   : '../../assets', // TODO review when reviewing HTML5 support
      index  : 'web.html',
      base   : '/web/'
    },
    api: {
      base: '/api'
    },
    redeem: {
      title : 'Redeem code',
      base  : '/redeem/'
    }
  },
  server: {
    port: process.env.PORT || 3000,
    logs: false,
    ssl: {
      enable      : true,
      port        : process.env.SSL_PORT || 443,
      key         : 'server/config/ssl/key.pem',
      certificate : 'server/config/ssl/certificate.crt',
      passphrase  : process.env.SSL_PASSPHRASE
    },
    auth: {
      issuer      : 'jedbangers',
      tokenSecret : process.env.TOKEN_SECRET,
      expiration  : 30 * 60 * 1000,
      cookieName  : 'jedbangers_jwt'
    }
  },
  mongo: {
    uri: process.env.MONGO_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  },
  redis: {
    keyspace: 'session:',
    connection: {
      url: process.env.REDIS_TLS_URL,
      socket: {
        tls: true,
        rejectUnauthorized: false, // needed by Heroku self-signed certificates
      }
    }
  },
  googleAnalytics: {
    trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    cookieOptions: 'auto'
  }
};
