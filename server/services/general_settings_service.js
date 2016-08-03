'use strict';

const _               = require('lodash');
const GeneralSettings = require('../model/general_settings');

module.exports = {
  getSettings() {
    return GeneralSettings.findAsync()
    .then((generalSettings) => {
      if (_.isArray(generalSettings) && generalSettings.length === 1) {
        return _.first(generalSettings);
      } else {
        return GeneralSettings.createAsync({});
      }
    });
  },

  updateSettings(newGeneralSettings) {
    return GeneralSettings.findAsync()
    .then((generalSettings) => {
      if (_.isArray(generalSettings) && generalSettings.length === 1) {
        const currentGeneralSettings = _.first(generalSettings);
        _.assign(currentGeneralSettings, newGeneralSettings);
        return currentGeneralSettings.saveAsync()
        .then(_.first);
      } else {
        return GeneralSettings.createAsync(newGeneralSettings);
      }
    });
  }
};
