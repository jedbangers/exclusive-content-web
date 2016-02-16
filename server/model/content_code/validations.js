'use strict';

const validator = require('validator');
const Settings = require('../../settings');

module.exports = function(schema) {

  schema.path('name')        .required(true, Settings.ContentCode.errors.name.required);
  schema.path('active')      .required(true, Settings.ContentCode.errors.active.required);
  schema.path('content.url') .required(true, Settings.ContentCode.errors.content.url.required);

  schema.path('content.url').validate(validator.isURL, Settings.ContentCode.errors.content.url.invalid);

};
