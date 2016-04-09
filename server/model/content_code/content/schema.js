'use strict';

const _           = require('lodash');
const mongoose    = require('mongoose');
const Settings    = require('../../../settings');
const validations = require('./validations');

const schema = new mongoose.Schema({
  title       : String,
  description : String,
  imageUrl    : String,
  url         : String
});

schema.plugin(validations);

function transform(doc, ret) {
  return _.pick(ret, Settings.Content.paths);
}

schema.set('toJSON',   { transform });
schema.set('toObject', { transform });

module.exports = schema;
