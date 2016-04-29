'use strict';

const _              = require('lodash');
const Bluebird       = require('bluebird');
const mongoose       = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const ShortId        = require('mongoose-shortid-nodeps');
const Settings       = require('../../settings');
const Content        = require('./content');
const validations    = require('./validations');

const schema = new mongoose.Schema({
  code: {
    type  : ShortId,
    index : true // Added to make the code unique
  },
  name: String,
  active: { type: Boolean, default: true },
  content: [ Content ]
});

schema.plugin(validations);
schema.plugin(mongooseDelete, { overrideMethods: 'all' });

function transform(doc, ret) {
  let result = _.cloneDeep(ret);
  result = _.pick(ret, Settings.ContentCode.paths);

  // Sort by created date. It would be better to add a created_at field.
  result.content = _.sortBy(result.content, (ci) => {
    return -ci._id.getTimestamp();
  });

  return result;
}

schema.set('toJSON',   { transform });
schema.set('toObject', { transform });

// Promisify mongoose-delete methods
Bluebird.promisifyAll(schema.methods);

module.exports = schema;
