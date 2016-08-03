'use strict'

_ = require 'lodash'

module.exports = ($scope, API, Settings, ConfigurableSettings) ->
  this.editing = false
  this.redeemCodeHintMaxLength = Settings.GeneralSettings.values.redeemCodeHint.maxLength
  this.model = ConfigurableSettings
  this.submittable = =>
    !this.submitting && $scope.generalSettingsForm.$dirty && !$scope.generalSettingsForm.$invalid

  this.cancel = =>
    this.editing = false

  this.save = =>
    this.submitting = true
    API.configurableSettings.update this.model
    .then =>
      this.editing = false
    .catch (err) => this.responseErrors = $scope.cleanResponseErrors err
    .finally => delete this.submitting

  # Must include this return statement
  # when using 'controller-as' syntax
  return;
