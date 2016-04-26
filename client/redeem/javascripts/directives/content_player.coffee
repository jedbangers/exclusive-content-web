'use strict'

module.exports = ->
  restrict: 'E'
  replace: true
  scope: {}
  bindToController:
    code: '='
    content: '='
  controllerAs: 'ctrl'
  controller: ->
    this.gaLabel = => JSON.stringify({ code: this.code, contentItem: this.content._id })
  template: """
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
  """
