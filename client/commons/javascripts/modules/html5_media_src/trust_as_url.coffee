'use strict'

module.exports = ($sce) -> (input) -> $sce.trustAsResourceUrl(input)
