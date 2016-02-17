'use strict'

templateLogin               = require '../../partials/_login.jade'
templateDashboard           = require '../../partials/_dashboard.jade'
templateHome                = require '../../partials/_home.jade'
templateBreadcrumbs         = require '../../partials/_breadcrumbs.jade'
templateAdminsList          = require '../../partials/_admins_list.jade'
templateAdminsProfile       = require '../../partials/_admins_profile.jade'
templateContentCodesList    = require '../../partials/_content_codes_list.jade'
templateContentCodesProfile = require '../../partials/_content_codes_profile.jade'

resolveAuthenticationAndEmitIf = (eventToEmit, emitIfAuthenticated) ->
  # Manual dependency injection annotations, as ngAnnotate is having problems
  # detecting this, even with explicit comments
  [ '$rootScope', '$q', 'AuthService', ($rootScope, $q, AuthService) ->
    AuthService.ensureAdminData()
    .then ->
      if emitIfAuthenticated
        $rootScope.$broadcast "auth:#{eventToEmit}"
        $q.reject()
    .catch ->
      if !emitIfAuthenticated
        $rootScope.$broadcast "auth:#{eventToEmit}"
        $q.reject() # Return a rejected promise so resolve does not 'resolves'
  ]

module.exports = ($locationProvider, $urlRouterProvider, $stateProvider, cfpLoadingBarProvider, $breadcrumbProvider) ->

  $locationProvider.html5Mode true
  $locationProvider.hashPrefix '!'

  cfpLoadingBarProvider.includeSpinner   = false
  cfpLoadingBarProvider.latencyThreshold = 1

  $breadcrumbProvider.setOptions
    prefixStateName : 'home'
    includeAbstract : true

  $urlRouterProvider.otherwise '/'

  $stateProvider.state 'login',
    url         : '/login'
    templateUrl : templateLogin
    controller  : 'LoginController'

  $stateProvider.state 'dashboard',
    abstract      : true
    templateUrl   : templateDashboard
    ncyBreadcrumb :
      skip : true

  $stateProvider.state 'home',
    parent        : 'dashboard'
    url           : '/'
    templateUrl   : templateHome
    ncyBreadcrumb :
      label: 'Dashboard'

  $stateProvider.state 'admins',
    parent        : 'dashboard'
    abstract      : true
    url           : '/admins'
    templateUrl   : templateBreadcrumbs
    ncyBreadcrumb :
      skip: true

  $stateProvider.state 'admins.list',
    url           : '/list'
    templateUrl   : templateAdminsList
    controller    : 'AdminsListController'
    ncyBreadcrumb :
      label: 'Admins'

  $stateProvider.state 'admins.add',
    url           : '/add'
    templateUrl   : templateAdminsProfile
    controller    : 'AdminsProfileController'
    resolve       :
      admin: -> undefined
    ncyBreadcrumb :
      parent : 'admins.list'
      label  : 'New'

  $stateProvider.state 'admins.edit',
    url           : '/edit/:id'
    templateUrl   : templateAdminsProfile
    controller    : 'AdminsProfileController'
    resolve       :
      admin: ($stateParams, API) -> API.admins.get($stateParams.id)
    ncyBreadcrumb :
      parent : 'admins.list'
      label  : 'Edit'

  $stateProvider.state 'contentCodes',
    parent        : 'dashboard'
    abstract      : true
    url           : '/contentCodes'
    templateUrl   : templateBreadcrumbs
    ncyBreadcrumb :
      skip: true

  $stateProvider.state 'contentCodes.list',
    url           : '/list'
    templateUrl   : templateContentCodesList
    controller    : 'ContentCodesListController'
    ncyBreadcrumb :
      label: 'ContentCodes'

  $stateProvider.state 'contentCodes.add',
    url           : '/add'
    templateUrl   : templateContentCodesProfile
    controller    : 'ContentCodesProfileController'
    resolve       :
      contentCode: -> undefined
    ncyBreadcrumb :
      parent : 'contentCodes.list'
      label  : 'New'

  $stateProvider.state 'contentCodes.edit',
    url           : '/edit/:id'
    templateUrl   : templateContentCodesProfile
    controller    : 'ContentCodesProfileController'
    resolve       :
      contentCode: ($stateParams, API) -> API.contentCodes.get($stateParams.id)
    ncyBreadcrumb :
      parent : 'contentCodes.list'
      label  : 'Edit'
