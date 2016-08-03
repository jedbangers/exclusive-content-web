'use strict';

const _                     = require('lodash');
const Bluebird              = require('bluebird');
const mongoose              = require('mongoose');
const Settings              = require('../../settings');
const validations           = require('./validations');

const schema = new mongoose.Schema({
  redeemCodeHint: String
});

schema.plugin(validations);

function transform(doc, ret) {
  return _.pick(ret, Settings.GeneralSettings.paths);
}

schema.set('toJSON',   { transform });
schema.set('toObject', { transform });

module.exports = schema;
