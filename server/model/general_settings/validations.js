'use strict';

const validator = require('validator');
const Settings = require('../../settings');

module.exports = function(schema) {

  schema.path('redeemCodeHint').validate((value) => {
    return validator.isLength(value, 0, Settings.GeneralSettings.values.redeemCodeHint.maxLength);
  }, Settings.GeneralSettings.errors.redeemCodeHint.maxLength);

};
