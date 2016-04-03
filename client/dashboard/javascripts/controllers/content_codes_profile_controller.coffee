'use strict'

module.exports = ($scope, $state, API, Settings, contentCode) ->
  $scope.descriptionMaxLength = Settings.ContentCode.values.description.maxLength;

  editing = !_.isEmpty contentCode
  action = if editing then _.partial(API.contentCodes.edit, contentCode._id) else API.contentCodes.create
  $scope.editing = editing

  # Initialize form model (to avoid ngIf child scopes creating their own 'model' property and thus, causing annoying bugs)
  $scope.model = {}

  if editing
    $scope.model.name        = contentCode.name
    $scope.model.code        = contentCode.code
    $scope.model.description = contentCode.description
    $scope.model.imageUrl    = contentCode.imageUrl
    $scope.model.content     = contentCode.content

  $scope.save = ->
    $scope.submitting = true
    action $scope.model
    .then        -> $state.go 'contentCodes.list'
    .catch (err) -> $scope.responseErrors = $scope.cleanResponseErrors err
    .finally     -> delete $scope.submitting

  $scope.cancel = -> $scope.goBack()

  $scope.submittable = -> !$scope.submitting && $scope.form.$dirty && !$scope.form.$invalid

  $scope.onImageUrlChange = -> $scope.loadingPreview = true

