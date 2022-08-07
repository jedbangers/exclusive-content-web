'use strict';

const config   = require('config');
const Bluebird = require('bluebird');
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');
const fs       = require('fs');

Bluebird.promisifyAll(mongoose.Model);
Bluebird.promisifyAll(mongoose.Model.prototype);
Bluebird.promisifyAll(mongoose.Query.prototype);

Bluebird.promisifyAll(jwt);
Bluebird.promisifyAll(fs);

if (config.env === config.environments.test) {
  Bluebird.promisifyAll(require('supertest'));
}
