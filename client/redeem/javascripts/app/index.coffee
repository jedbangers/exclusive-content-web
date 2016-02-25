'use strict'

angular                      = require 'angular'
connectionRefusedInterceptor = require '../../../commons/javascripts/modules/connection_refused_interceptor'
errorModal                   = require '../../../commons/javascripts/modules/error_modal'
redeemCodeController         = require '../controllers/redeem_code_controller'

angular
.module 'codeRedeemer', [
  connectionRefusedInterceptor
  errorModal
]

.controller 'RedeemCodeController', redeemCodeController

.config ($locationProvider) ->
  $locationProvider.html5Mode true
  $locationProvider.hashPrefix '!'

.run ($rootScope, errorModal) ->

  $rootScope.$on 'connection_refused', (msg, data) ->
    errorModal.open 'Connection refused by server', -1

module.exports = 'codeRedeemer'
