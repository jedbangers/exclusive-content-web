'use strict'

module.exports = ($http) ->

  this.doRedeem = =>
    this.clearErrors()

    this.loading = true
    this.selectedContentItem = null;

    $http
      method: 'GET'
      url: "/api/contentCodes/code/#{this.code}"
    .then (res) =>
      this.contentCode = res.data

      if this.hasContentItems()
        this.selectedContentItem = this.contentCode.content[0]

    .catch (err) =>
      if err.status != -1
        this.error =
          title   : "An #{err.status} error has occurred"
          message : if err.data && err.data.message then err.data.message else err.statusText

    .then =>
      delete this.loading

  this.clearErrors = =>
    delete this.error

  this.contentSource = => "/stream/#{this.selectedContentItem.code}"

  this.hasContentItems = => this.contentCode.content && this.contentCode.content.length > 0

  this.selectContentItem = (ci) => this.selectedContentItem = ci

  this.isAnyContentItemSelected = => !!this.selectedContentItem

  this.isSelected = (ci) => ci == this.selectedContentItem


  # "NOTE!: Considering CoffeeScript automatically returns the last line,
  # we must place a return statement at the bottom so the controller doesn't
  # return anything. In most cases you do not need the return statement.
  # However, I ran into a few issues not using it while running tests on
  # these functions. So I highly recommend using it."
  # src: https://github.com/Plateful/plateful-mobile/wiki/AngularJS-CoffeeScript-Style-Guide
  return
