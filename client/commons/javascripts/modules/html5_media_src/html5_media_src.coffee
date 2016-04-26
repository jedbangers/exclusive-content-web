'use strict'

module.exports = ($sce) ->
  restrict: 'A'
  link: (scope, element, attr) ->
    attr.$set('src', $sce.trustAsResourceUrl(attr.msrc))
