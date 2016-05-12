'use strict'

module.exports = ->
  restrict: 'E'
  replace: true
  scope: true
  link: ($scope, element, attrs) ->
    $scope.form                 = $scope.$eval attrs.form
    $scope.item                 = $scope.$eval attrs.item
    $scope.inputPrefix          = ($scope.$eval attrs.inputPrefix) || ''
    $scope.titleMaxLength       = $scope.$eval attrs.titleMaxLength
    $scope.descriptionMaxLength = $scope.$eval attrs.descriptionMaxLength

    $scope.$watch attrs.form, (value) -> $scope.form = value
    $scope.$watch attrs.item, (value) -> $scope.item = value
    $scope.$watch attrs.inputPrefix, (value) -> $scope.inputPrefix = value || '';
    $scope.$watch attrs.titleMaxLength, (value) -> $scope.titleMaxLength = value
    $scope.$watch attrs.descriptionMaxLength, (value) -> $scope.descriptionMaxLength = value

  template: """
    <div>
      <div class="form-group" ng-class="{ 'has-error': form.hasError(inputPrefix + 'title') }" class="row">
        <div class="col-md-7">
          <label for="{{ inputPrefix }}title" class="control-label">Title *</label>
          <input
            class="form-control"
            type="text"
            name="{{ inputPrefix }}title"
            ng-model="item.title"
            ng-maxlength="titleMaxLength"
            required="required"
          />
        </div>
        <div class="col-md-5">
          <br/>
          <div class="help-block"
            ng-show="form.hasError(inputPrefix + 'title')"
            ng-messages="form[inputPrefix + 'title'].$error"
          >
            <i class="fa fa-warning">&nbsp;</i>
            <span ng-message="required">Title cannot be empty.</span>
            <span ng-message="maxlength">
              Title is too long ({{ titleMaxLength }} characters max)
            </span>
          </div>
        </div>
      </div>

      <div class="form-group" ng-class="{ 'has-error': form.hasError(inputPrefix + 'description') }" class="row">
        <div class="col-md-7">
          <label for="{{ inputPrefix }}description" class="control-label">Description</label>
          <textarea
            class="form-control"
            type="text"
            name="{{ inputPrefix }}description"
            ng-model="item.description"
            ng-maxlength="descriptionMaxLength" />
        </div>
        <div class="col-md-5">
          <br/>
          <div
            class="help-block"
            ng-show="form.hasError(inputPrefix + 'description')"
            ng-messages="form[inputPrefix + 'description'].$error"
          >
            <i class="fa fa-warning">&nbsp;</i>
            <span ng-message="maxlength">
              Description is too long ({{ descriptionMaxLength }} characters max)
            </span>
          </div>
        </div>
      </div>

      <div class="form-group" ng-class="{ 'has-error': form.hasError(inputPrefix + 'imageUrl') }" class="row">
        <div class="col-md-7">
          <label for="{{ inputPrefix }}imageUrl" class="control-label">Preview Image URL</label>
          <input
            class="form-control"
            type="url"
            name="{{ inputPrefix }}imageUrl"
            ng-model="item.imageUrl"
          />
        </div>
        <div class="col-md-5">
          <br/>
          <div
            class="help-block"
            ng-show="form.hasError(inputPrefix + 'imageUrl')"
            ng-messages="form[inputPrefix + 'imageUrl'].$error"
          >
            <i class="fa fa-warning">&nbsp;</i>
            <span ng-message="url">Preview Image URL is not a valid URL</span>
          </div>
        </div>
      </div>

      <div class="form-group" ng-class="{ 'has-error': form.hasError(inputPrefix + 'url') }" class="row">
        <div class="col-md-7">
          <label for="{{ inputPrefix }}url" class="control-label">URL</label>
          <input
            class="form-control"
            type="url"
            name="{{ inputPrefix }}url"
            ng-model="item.url"
          />
        </div>
        <div class="col-md-5">
          <br/>
          <div
            class="help-block"
            ng-show="form.hasError(inputPrefix + 'url')"
            ng-messages="form[inputPrefix + 'url'].$error"
          >
            <i class="fa fa-warning">&nbsp;</i>
            <span ng-message="url">URL is not a valid URL</span>
          </div>
        </div>
      </div>
    </div>
  """
