'use strict'

require './redeemed_code.less';

module.exports = ->
  restrict: 'E'
  replace: true
  scope: true
  controllerAs: 'ctrl'
  bindToController:
    content: '='
    onClick: '&'

  controller: ->
    return

  template: """
    <div class="redeemed-code container-fluid">
      <div class="row">
        <div class="col-xs-9 text-left">
          <span class="content-name">
            <span class="glyphicon glyphicon-fire"></span>
            {{ ctrl.content.name }}
          </span>
          <br />
          <small class="text-warning">
            {{ ctrl.content.code }}
          </small>
          <br />
          <small>
            Canjeado por primera vez:
            {{ ctrl.content.redeemedAt | date:'dd/MM/yyyy @ h:mma'}}
          </small>
        </div>
        <div class="col-xs-3 text-right">
          <button class="btn btn-success" ng-click="ctrl.onClick()">
            <span class="glyphicon glyphicon-eye-open"></span>
            Ver
          </button>
        </div>
      </div>
    </div>
  """
