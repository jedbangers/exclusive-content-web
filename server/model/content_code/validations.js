'use strict';

const _         = require('lodash');
const validator = require('validator');
const Settings  = require('../../settings');

module.exports = function(schema) {

  schema.path('name')        .required(true, Settings.ContentCode.errors.name.required);
  schema.path('active')      .required(true, Settings.ContentCode.errors.active.required);
  schema.path('content.url') .required(true, Settings.ContentCode.errors.content.url.required);

  schema.path('description').validate((value) => {
    return validator.isLength(value, 0, Settings.ContentCode.values.description.maxLength);
  }, Settings.ContentCode.errors.description.maxLength);

  schema.path('imageUrl').validate((value) => {
    return _.isEmpty(value) || validator.isURL(value);
  }, Settings.ContentCode.errors.imageUrl.invalid);

  schema.path('content.url').validate(validator.isURL, Settings.ContentCode.errors.content.url.invalid);

};
