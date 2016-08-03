'use strict'

$ = require 'jquery'

module.exports = (Restangular) ->
  api = Restangular.all 'api'

  auth:
    me: ->
      api.one('auth', 'me').get()
      .then Restangular.stripRestangular

    login: (email, password) ->
      body = $.param
        email    : email,
        password : password

      headers =
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'

      api.one('auth', 'login').customPOST body, undefined, undefined, headers
      .then Restangular.stripRestangular

    logout: ->
      api.one('auth', 'logout').post()

  admins:
    total: ->
      api.one('admins', 'total').get()
      .then _.property('total')

    list: (skip, limit) ->
      api.customGETLIST 'admins',
        skip  : skip
        limit : limit

    get: (id) ->
      api.one('admins', id).get()

    create: (admin) ->
      body = $.param
        email           : admin.email
        password        : admin.password
        confirmPassword : admin.confirmPassword

      headers =
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'

      api.one('admins').customPOST body, undefined, undefined, headers

    edit: (id, admin) ->
      body = $.param
        email           : admin.email
        password        : admin.password
        newPassword     : admin.newPassword
        confirmPassword : admin.confirmPassword

      headers =
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'

      api.one('admins', id).customPUT body, undefined, undefined, headers

    delete: (id) ->
      api.one('admins', id).remove()

  contentCodes:
    total: ->
      api.one('contentCodes', 'total').get()
      .then _.property('total')

    list: (skip, limit) ->
      api.customGETLIST 'contentCodes',
        skip  : skip
        limit : limit

    get: (id) ->
      api.one('contentCodes', id).get()

    create: (contentCode) ->
      body = $.param
        name    : contentCode.name
        code    : contentCode.code
        content : contentCode.content

      headers =
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'

      api.one('contentCodes').customPOST body, undefined, undefined, headers

    edit: (id, contentCode) ->
      body = $.param
        name    : contentCode.name
        code    : contentCode.code
        content : contentCode.content

      headers =
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'

      api.one('contentCodes', id).customPUT body, undefined, undefined, headers

    delete: (id) ->
      api.one('contentCodes', id).remove()

  configurableSettings:
    update: (cs) ->
      body = $.param
        redeemCodeHint: cs.redeemCodeHint

      headers =
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'

      api.one('generalSettings').customPUT body, undefined, undefined, headers

