'use strict';

var Environments = require('./environments');

module.exports = {
  env: Environments.development,
  server: {
    logs: true,
    ssl: {
      port: 3001
    },
    auth: {
      token_secret: 'mercyfulfate'
    }
  },
  mongo: {
    uri: 'mongodb://localhost/seed_dev'
  }
};
