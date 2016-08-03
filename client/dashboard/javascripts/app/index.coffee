'use strict'

angular = require 'angular'

# TinyMCE
require 'tinymce/tinymce'
require 'tinymce/themes/modern/theme'
require 'tinymce/plugins/advlist/plugin'
require 'tinymce/plugins/autolink/plugin'
require 'tinymce/plugins/link/plugin'
require 'tinymce/plugins/image/plugin'
require 'tinymce/plugins/lists/plugin'
require 'tinymce/plugins/charmap/plugin'
require 'tinymce/plugins/print/plugin'
require 'tinymce/plugins/preview/plugin'
require 'tinymce/plugins/code/plugin'
require 'tinymce/plugins/textcolor/plugin'

require 'angular-animate'
require 'angular-breadcrumb'
require 'angular-messages'
require 'angular-ui-router'
require 'angular-ui-tinymce'
require 'ngstorage'
require 'restangular'
require 'angular-loading-bar'
require 'angular-spinner'

# Fix this ugly bit of code
require 'ng-table-async/node_modules/ng-table/dist/ng-table'
require 'ng-table-async'

uibs    = require 'angular-ui-bootstrap'

# Commons
connectionRefusedInterceptor = require '../../../commons/javascripts/modules/connection_refused_interceptor'
errorModal                   = require '../../../commons/javascripts/modules/error_modal'
confirmationModal            = require '../../../commons/javascripts/modules/confirmation_modal'
authInterceptor              = require '../../../commons/javascripts/modules/auth_interceptor'

# Modules
api = require '../modules/api'

# Services
authService = require '../services/auth_service'

# Controllers
loginController               = require '../controllers/login_controller'
adminsListController          = require '../controllers/admins_list_controller'
adminsProfileController       = require '../controllers/admins_profile_controller'
contentCodesListController    = require '../controllers/content_codes_list_controller'
contentCodesProfileController = require '../controllers/content_codes_profile_controller'

# Directives
navbar                  = require '../directives/navbar'
compareToModel          = require '../directives/compare_to_model'
imageLoading            = require '../directives/image_loading'
contentItemImagePreview = require '../directives/content_item_image_preview'
contentItemForm         = require '../directives/content_item_form'

# App
appRun    = require './app_run'
appConfig = require './app_config'

angular
.module 'dashboard', [
  'ui.router'
  'ui.tinymce'
  'restangular'
  'ngAnimate'
  'ngStorage'
  'angular-loading-bar'
  'ngMessages'
  'ngTableAsync'
  'ncy-angular-breadcrumb'
  'angularSpinner'
  uibs
  connectionRefusedInterceptor
  errorModal
  confirmationModal
  authInterceptor
  api
]

.constant   'Settings',                      window.Jedbangers.Settings
.controller 'LoginController',               loginController
.controller 'AdminsListController',          adminsListController
.controller 'AdminsProfileController',       adminsProfileController
.controller 'ContentCodesListController',    contentCodesListController
.controller 'ContentCodesProfileController', contentCodesProfileController

.factory    'AuthService',             authService
.directive  'navbar',                  navbar
.directive  'compareToModel',          compareToModel
.directive  'imageLoading',            imageLoading
.directive  'contentItemImagePreview', contentItemImagePreview
.directive  'contentItemForm',         contentItemForm

.config appConfig
.run appRun

module.exports = 'dashboard'
