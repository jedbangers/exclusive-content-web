'use strict'

module.exports = ($scope, $q, $state, API, confirmationModal) ->

  $scope.addContentCode = ->
    $state.go 'contentCodes.add'

  $scope.getContentCodePage = (skip, limit) ->
    $q.all [
      API.contentCodes.total()
      API.contentCodes.list skip, limit
    ]

  $scope.tableOptions =
    getPage: $scope.getContentCodePage
    actions:
      inspect:
        method : (contentCode) -> $state.go 'contentCodes.edit', id: contentCode._id
        reload : false
      remove:
        method : (contentCode) ->
          confirmationModal.open
            title       : 'Delete content code'
            message     : "Do you wish to delete content code #{contentCode.name}?"
            closeLabel  : 'Cancel'
            acceptLabel : 'Delete'
          .result
          .then -> API.contentCodes.delete contentCode._id
