'use strict';

const validator = require('validator');
const Settings  = require('../../settings');

module.exports = function(schema) {

  schema.path('name')   .required(true, Settings.ContentCode.errors.name.required);
  schema.path('active') .required(true, Settings.ContentCode.errors.active.required);

  schema.path('name').validate((value) => {
    return validator.isLength(value, 0, Settings.ContentCode.values.name.maxLength);
  }, Settings.ContentCode.errors.name.maxLength);

};
