'use strict'

require './stylesheets/app.less'

app = require './javascripts/app'

document.body.setAttribute 'ng-app', app

div = document.createElement 'div'
div.innerHTML = require './main.jade'

document.body.insertBefore div.firstChild, document.body.firstChild
