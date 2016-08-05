'use strict'

_ = require 'lodash'

module.exports = ($scope, API, Settings, ConfigurableSettings) ->

  this.redeemCodeHintTinyMceOptions = _.assign(
    {},
    $scope.tinyMceOptions,
      height: 100,
      # plugins: 'advlist autolink link image lists charmap print preview code textcolor',
      toolbar: 'undo redo | bold italic | forecolor backcolor | link'
  )

  this.redeemCodeHintMaxLength = Settings.GeneralSettings.values.redeemCodeHint.maxLength
  this.model = ConfigurableSettings
  this.submittable = =>
    !this.submitting && $scope.generalSettingsForm.$dirty && !$scope.generalSettingsForm.$invalid

  this.save = =>
    this.submitting = true
    API.configurableSettings.update this.model
    .then => $scope.generalSettingsForm.$setPristine()
    .catch (err) => this.responseErrors = $scope.cleanResponseErrors err
    .finally => delete this.submitting

  # Must include this return statement
  # when using 'controller-as' syntax
  return;
