'use strict';

const express     = require('express');
const superagent  = require('superagent');
const ContentCode = require('../model/content_code');

module.exports = function() {

  const router = express.Router();

  router.get('/:code', (req, res, next) => {
    ContentCode.findOneAsync({ code: req.params.code })
    .then((contentCode) => {
      superagent.get(contentCode.content.url).pipe(res);
    })
    .catch(next);
  });

  return router;

};
