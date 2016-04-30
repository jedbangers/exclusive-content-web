'use strict'

require 'localforage'

angular = require 'angular'

require 'angular-spinner'
require 'angular-loading-spinner'
require 'angulartics'
require 'imports?this=>window!angular-localforage'

angularticsGoogleAnalytics = require 'angulartics-google-analytics'

connectionRefusedInterceptor = require '../../../commons/javascripts/modules/connection_refused_interceptor'
errorModal                   = require '../../../commons/javascripts/modules/error_modal'
html5MediaSrc                = require '../../../commons/javascripts/modules/html5_media_src'
redeemCodeController         = require '../controllers/redeem_code_controller'
contentPlayer                = require '../directives/content_player'
redeemedCode                 = require '../directives/redeemed_code'

angular
.module 'codeRedeemer', [
  'angularSpinner'
  'ngLoadingSpinner'
  'angulartics'
  angularticsGoogleAnalytics
  connectionRefusedInterceptor
  errorModal
  html5MediaSrc
  'LocalForageModule'
]

.controller 'RedeemCodeController', redeemCodeController
.directive 'contentPlayer', contentPlayer
.directive 'redeemedCode', redeemedCode

.config ($analyticsProvider, $localForageProvider) ->

  $analyticsProvider.virtualPageviews false

  # https://github.com/angulartics/angulartics#full-path-tracking-for-pages-without-a-router
  $analyticsProvider.firstPageview true
  $analyticsProvider.withBase true

  $localForageProvider.config
    name      : 'jeds'
    storeName : 'redeemed'

.run ($rootScope, errorModal) ->

  $rootScope.$on 'connection_refused', (msg, data) ->
    errorModal.open 'Connection refused by server', -1

module.exports = 'codeRedeemer'
