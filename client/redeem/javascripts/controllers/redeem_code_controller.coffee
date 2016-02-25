'use strict'

module.exports = ($http) ->

  this.doRedeem = =>
    this.clearErrors()

    $http
      method: 'GET'
      url: "/api/contentCodes/code/#{this.code}"
    .then (res) =>
      this.contentCode = res.data

    .catch (err) =>
      if err.status != -1
        this.error =
          title   : "An #{err.status} error has occurred"
          message : if err.data && err.data.message then err.data.message else err.statusText

  this.clearErrors = =>
    delete this.error

  this.contentSource = => "/streamContent/#{this.contentCode.code}"

  # "NOTE!: Considering CoffeeScript automatically returns the last line,
  # we must place a return statement at the bottom so the controller doesn't
  # return anything. In most cases you do not need the return statement.
  # However, I ran into a few issues not using it while running tests on
  # these functions. So I highly recommend using it."
  # src: https://github.com/Plateful/plateful-mobile/wiki/AngularJS-CoffeeScript-Style-Guide
  return
