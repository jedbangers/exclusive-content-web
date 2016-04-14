'use strict'

module.exports = ->
  restrict: 'E'
  replace: true
  scope:
    url: '='
  template: """
    <img class="img-responsive" ng-src="{{ url }}"></img>
  """
