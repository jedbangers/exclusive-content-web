'use strict'

angular              = require 'angular'
redeemCodeController = require '../controllers/redeem_code_controller'

angular
.module 'codeRedeemer', []

.controller 'RedeemCodeController', redeemCodeController

.config ($locationProvider) ->
  $locationProvider.html5Mode true
  $locationProvider.hashPrefix '!'

.run()

module.exports = 'codeRedeemer'
