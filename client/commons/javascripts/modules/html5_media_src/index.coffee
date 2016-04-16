# Solution from: https://github.com/angular/angular.js/issues/1352
#
# USAGE
#   <source ng-repeat="source in sources" msrc="{{ source.path }}" type="{{ source.type }}" html5MediaSrc>
#

'use strict'

angular       = require 'angular'
html5MediaSrc = require './html5_media_src'

angular
.module 'html5-media-src', []
.directive 'html5MediaSrc', html5MediaSrc

module.exports = 'html5-media-src'
