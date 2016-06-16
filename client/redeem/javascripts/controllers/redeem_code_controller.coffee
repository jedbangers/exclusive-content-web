'use strict'

_ = require 'lodash'

module.exports = ($http, $localForage, $sce) ->

  buildCacheContent = (content, redeemedAt) ->
    code: content.code
    name: content.name
    redeemedAt: redeemedAt

  this.trustAsHtml = (resource) -> $sce.trustAsHtml(resource)

  this.fetchContentCode = (code) =>
    $localForage.getItem(code)
    .then (cached) =>
      $http
        method: 'GET'
        url: "/api/contentCodes/code/#{code}"

      .then (res) =>
        item = res.data
        cache = buildCacheContent(item, if cached then cached.redeemedAt else Date.now())
        # Cache redeem code using local forage
        $localForage.setItem code, cache
        .then => this.fetchRedeemedCodes()
        .then ->
          item

  this.fetchRedeemedCodes = =>
    $localForage.keys()
    .then (keys) -> $localForage.getItem(keys)
    .then (items) -> _.sortBy items, (i) -> -i.redeemedAt
    .then (redeemedCodes) => this.redeemedCodes = redeemedCodes

  this.fetchRedeemedCodes()

  this.doRedeem = => this.goToContent(this.code)

  this.goToContent = (code) =>
    this.clearErrors()
    this.loading = true
    this.fetchContentCode(code)
    .then (contentCode) =>
      this.contentCode = contentCode
    .catch (err) =>
      if err.status != -1
        this.error =
          title   : "An #{err.status} error has occurred"
          message : if err.data && err.data.message then err.data.message else err.statusText
    .then =>
      delete this.loading

  this.clearErrors = =>
    delete this.error

  this.goBack = =>
    this.contentCode = null
    this.code = null

  this.contentSource = (ci) => "/stream/#{ci.code}"

  this.hasContentItems = => this.contentCode.content && this.contentCode.content.length > 0

  this.downloadContentItemAnalyticsValue = (ci) =>
    JSON.stringify
      code        : this.code
      contentCode : this.contentCode._id
      contentItem : ci._id

  # "NOTE!: Considering CoffeeScript automatically returns the last line,
  # we must place a return statement at the bottom so the controller doesn't
  # return anything. In most cases you do not need the return statement.
  # However, I ran into a few issues not using it while running tests on
  # these functions. So I highly recommend using it."
  # src: https://github.com/Plateful/plateful-mobile/wiki/AngularJS-CoffeeScript-Style-Guide
  return
