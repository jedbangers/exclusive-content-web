'use strict';

const _              = require('lodash');
const Bluebird       = require('bluebird');
const mongoose       = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const ShortId        = require('mongoose-shortid-nodeps');
const Settings       = require('../../settings');
const validations    = require('./validations');

const schema = new mongoose.Schema({
  code: {
    type  : ShortId,
    index : true // Added to make the code unique
  },
  name: String,
  active: { type: Boolean, default: true },
  content: {
    url: { type: String, lowercase: true }
  },
  authorizedEmails: [{
    email        : { type: String, lowercase: true },
    authorizedAt : Date
  }]
});

schema.plugin(validations);
schema.plugin(mongooseDelete, { overrideMethods: 'all' });

function transform(doc, ret) {
  return _.pick(ret, Settings.ContentCode.paths);
}

schema.set('toJSON',   { transform });
schema.set('toObject', { transform });

// Promisify mongoose-delete methods
Bluebird.promisifyAll(schema.methods);

module.exports = schema;
