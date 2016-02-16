'use strict';

const Environments = require('./environments');

module.exports = {
  env: Environments.test,
  server: {
    auth: {
      tokenSecret: 'mercyfulfate'
    }
  },
  mongo: {
    uri: 'mongodb://localhost/jedbangers_exclusive_content_test'
  }
};
