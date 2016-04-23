'use strict'

require './stylesheets/app.less'

require './javascripts/app'

document.body.setAttribute 'ng-app', 'codeRedeemer'

div = document.createElement 'div'
div.innerHTML = require './main.jade'

document.body.insertBefore div.firstChild, document.body.firstChild
