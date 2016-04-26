'use strict'

require './content_player.less';

module.exports = ->
  restrict: 'E'
  replace: true
  scope: {}
  controllerAs: 'ctrl'
  bindToController:
    code: '='
    content: '='

  controller: ->
    this.gaLabel = => JSON.stringify({ code: this.code, contentItem: this.content._id })

    this.isVideoURL = =>
      this.content.url.indexOf('youtube') != -1 ||
      this.content.url.indexOf('vimeo') != -1

    return

  template: """
    <div class="content-player">
      <div ng-if="ctrl.isVideoURL()" class="content-player-container embed-responsive embed-responsive-16by9">
        <iframe
          class="embed-responsive-item"
          frameborder="0"
          allowfullscreen
          webkitallowfullscreen
          mozallowfullscreen
          ng-src="{{ ctrl.content.url | trustAsUrl }}">
        </iframe>
      </div>

      <div ng-if="!ctrl.isVideoURL()" class="content-player-container">
        <audio controls>
          <source
            type="audio/mp3"
            msrc="{{ ctrl.content.url }}"
            html5-media-src
            analytics-on       = "play"
            analytics-event    = "Play content"
            analytics-category = "Contents"
            analytics-label    = "{{ ctrl.gaLabel() }}" >
          </source>
          Tu navegador no soporta la reproduccion de audio de manera nativa.
        </audio>

        <a
          download
          class   = "btn btn-primary btn-xs"
          target  = "_blank"
          ng-href = "{{ ctrl.content.url }}"
          analytics-on       = "click"
          analytics-event    = "Download content"
          analytics-category = "Contents"
          analytics-label    = "{{ ctrl.gaLabel() }}"
        >
          <span class="glyphicon glyphicon-download"></span>
          &nbsp;Descargar
        </a>
      </div>
    </div>
  """
