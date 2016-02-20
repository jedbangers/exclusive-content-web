'use strict'

require './stylesheets/app.less'

div = document.createElement 'div'
div.innerHTML = require './main.jade'
document.body.appendChild div.firstChild
