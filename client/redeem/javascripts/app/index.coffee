'use strict'

require 'angular-spinner'
require 'angular-loading-spinner'

angular                      = require 'angular'
connectionRefusedInterceptor = require '../../../commons/javascripts/modules/connection_refused_interceptor'
errorModal                   = require '../../../commons/javascripts/modules/error_modal'
html5MediaSrc                = require '../../../commons/javascripts/modules/html5_media_src'
redeemCodeController         = require '../controllers/redeem_code_controller'

angular
.module 'codeRedeemer', [
  'angularSpinner'
  'ngLoadingSpinner'
  connectionRefusedInterceptor
  errorModal
  html5MediaSrc
]

.controller 'RedeemCodeController', redeemCodeController

.config ($locationProvider) ->
  $locationProvider.html5Mode true
  $locationProvider.hashPrefix '!'

.run ($rootScope, errorModal) ->

  $rootScope.$on 'connection_refused', (msg, data) ->
    errorModal.open 'Connection refused by server', -1

module.exports = 'codeRedeemer'
