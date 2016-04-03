'use strict'

module.exports = ($log) ->
  restrict: 'A'
  link: ($scope, element, attrs) ->
    element.bind 'load', ->
      $log.debug 'image is loaded'
      $scope.$apply attrs.imageLoading
    element.bind 'error', ->
      $log.debug 'image could not be loaded'
