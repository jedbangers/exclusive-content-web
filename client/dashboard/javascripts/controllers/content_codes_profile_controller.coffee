'use strict'

_ = require 'lodash'

module.exports = ($scope, $state, API, confirmationModal, Settings, contentCode, $uibModal) ->
  $scope.nameMaxLength               = Settings.ContentCode.values.name.maxLength
  $scope.contentTitleMaxLength       = Settings.Content.values.title.maxLength
  $scope.contentDescriptionMaxLength = Settings.Content.values.description.maxLength

  editing = !_.isEmpty contentCode
  action = if editing then _.partial(API.contentCodes.edit, contentCode._id) else API.contentCodes.create
  $scope.editing = editing

  # Initialize form model (to avoid ngIf child scopes creating their own 'model' property and thus, causing annoying bugs)
  $scope.model =
    content: []

  if editing
    $scope.model.name    = contentCode.name
    $scope.model.code    = contentCode.code
    $scope.model.content = contentCode.content

  $scope.noContentItems = -> $scope.model.content.length == 0

  $scope.save = ->
    $scope.submitting = true
    action $scope.model
    .then        -> $state.go 'contentCodes.list'
    .catch (err) -> $scope.responseErrors = $scope.cleanResponseErrors err
    .finally     -> delete $scope.submitting

  $scope.cancel = -> $scope.goBack()

  $scope.submittable = -> !$scope.submitting && $scope.form.$dirty && !$scope.form.$invalid

  $scope.onImageUrlChange = -> $scope.loadingPreview = true

  $scope.openDeleteModal = (contentItem) ->
    confirmationModal.open
      title       : 'Delete item'
      message     : "Do you wish to delete \"#{contentItem.title}\" content item?"
      closeLabel  : 'Cancel'
      acceptLabel : 'Delete'
    .result
    .then ->
      _.remove($scope.model.content, (ci) -> ci._id == contentItem._id)
      $scope.form.$setDirty()

  $scope.openNewContentItemModal = () ->
    $uibModal.open
      controller  : [ '$scope', ($scope) ->
        $scope.contentTitleMaxLength       = Settings.Content.values.title.maxLength
        $scope.contentDescriptionMaxLength = Settings.Content.values.description.maxLength
        $scope.model = {}
      ]
      size: 'lg'
      template: """
        <div class="modal-header">
          <button type="button" class="close" aria-label="Close" ng-click="$dismiss()">
            <span aria-hidden="true">&times;</span>
          </button>
          <h3 class="modal-title">New content item</h3>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-3">
                <strong>Preview image</strong>
                <br />
                <content-item-image-preview url="model.imageUrl"></content-item-image-preview>
              </div>
              <div class="col-md-9">
                <form name="new_content_item_form">
                  <div ng-init="extendForm(new_content_item_form)"></div>
                  <content-item-form
                    form="new_content_item_form"
                    item="model"
                    title-max-length="contentTitleMaxLength"
                    description-max-length="contentDescriptionMaxLength"></content-item-form>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" type="button" ng-click="$dismiss()">Cancel</button>
          <button
            class="btn btn-primary"
            type="button"
            ng-click="$close(model)"
            ng-disabled="new_content_item_form.$invalid"
          >Add new item</button>
        </div>
      """
    .result
    .then (contentItem) ->
      $scope.model.content.push(contentItem)
      $scope.form.$setDirty()
