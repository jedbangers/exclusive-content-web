'use strict'

angular = require 'angular'

require 'angular-spinner'
require 'angular-loading-spinner'
require 'angulartics'

angularticsGoogleAnalytics = require 'angulartics-google-analytics'

connectionRefusedInterceptor = require '../../../commons/javascripts/modules/connection_refused_interceptor'
errorModal                   = require '../../../commons/javascripts/modules/error_modal'
html5MediaSrc                = require '../../../commons/javascripts/modules/html5_media_src'
redeemCodeController         = require '../controllers/redeem_code_controller'

angular
.module 'codeRedeemer', [
  'angularSpinner'
  'ngLoadingSpinner'
  'angulartics'
  angularticsGoogleAnalytics
  connectionRefusedInterceptor
  errorModal
  html5MediaSrc
]

.controller 'RedeemCodeController', redeemCodeController

.config ($locationProvider, $analyticsProvider) ->

  $analyticsProvider.virtualPageviews false

  # https://github.com/angulartics/angulartics#full-path-tracking-for-pages-without-a-router
  $analyticsProvider.firstPageview true
  $analyticsProvider.withBase true

#   $locationProvider.html5Mode true
#   $locationProvider.hashPrefix '!'

.run ($rootScope, errorModal) ->

  $rootScope.$on 'connection_refused', (msg, data) ->
    errorModal.open 'Connection refused by server', -1

module.exports = 'codeRedeemer'
