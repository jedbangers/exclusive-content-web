'use strict';

const _         = require('lodash');
const validator = require('validator');
const Settings  = require('../../../settings');

module.exports = function(schema) {

  schema.path('title').required(true, Settings.Content.errors.title.required);

  schema.path('title').validate((value) => {
    return validator.isLength(value, 0, Settings.Content.values.title.maxLength);
  }, Settings.Content.errors.title.maxLength);

  // Due to the capability of description to contain HTML,
  // maxLength validation is now disabled. Too lazy to implement it properly,
  // removing HTML tags before checking length.
  // schema.path('description').validate((value) => {
  //   return validator.isLength(value, 0, Settings.Content.values.description.maxLength);
  // }, Settings.Content.errors.description.maxLength);

  schema.path('imageUrl').validate((value) => {
    return _.isEmpty(value) || validator.isURL(value);
  }, Settings.Content.errors.imageUrl.invalid);

  schema.path('url').validate((value) => {
    return _.isEmpty(value) || validator.isURL(value);
  }, Settings.Content.errors.url.invalid);

};
