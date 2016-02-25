'use strict';

const _           = require('lodash');
const express     = require('express');
const Response    = require('simple-response');
const ContentCode = require('../model/content_code');
const RouteUtils  = require('../utils/route_utils');
const Settings    = require('../settings');
const Middlewares = require('../middlewares');

const router = express.Router();

router.get('/',
  Middlewares.Normalize('query.skip').as('integer', { defaultsTo: 0 }),
  Middlewares.Normalize('query.limit').as('integer', { defaultsTo: 0 }),
  (req, res, next) => {
    ContentCode.findAsync({}, Settings.ContentCode.paths.join(' '), {
      skip  : req.query.skip,
      limit : req.query.limit,
      sort  : Settings.ContentCode.sort
    })
    .then(Response.Ok(res))
    .catch(next);
  }
);

router.get('/total', (req, res, next) => {
  ContentCode.countAsync()
  .then((total) => {
    Response.Ok(res)({ total });
  })
  .catch(next);
});

router.get('/:id',
  RouteUtils.validateId(),
  RouteUtils.populateDocument({
    model      : ContentCode,
    populateTo : 'fetchedContentCode',
    fields     : Settings.ContentCode.paths.join(' ')
  }),
  (req, res) => {
    Response.Ok(res)(req.fetchedContentCode);
  }
);

router.get('/code/:code',
  RouteUtils.populateDocument({
    model      : ContentCode,
    param      : 'params.code:code',
    populateTo : 'fetchedContentCode',
    fields     : Settings.ContentCode.paths.join(' ')
  }),
  (req, res) => {
    const cc = _.omit(req.fetchedContentCode.toObject(), 'content');
    Response.Ok(res)(cc);
  }
);

router.post('/', (req, res, next) => {
  const cc = new ContentCode(req.body);
  cc.saveAsync()
  .then(Response.Ok(res))
  .catch(next);
});

router.put('/:id',
  RouteUtils.validateId(),
  RouteUtils.populateDocument({
    model      : ContentCode,
    populateTo : 'fetchedContentCode'
  }),
  (req, res, next) => {
    _.merge(req.fetchedContentCode, req.body);
    req.fetchedContentCode.saveAsync()
    .then(_.first)
    .then(Response.Ok(res))
    .catch(next);
  }
);

router.delete('/:id',
  RouteUtils.validateId(),
  RouteUtils.populateDocument({
    model      : ContentCode,
    populateTo : 'fetchedContentCode'
  }),
  (req, res, next) => {
    req.fetchedContentCode.deleteAsync(req.auth.user._id)
    .then(Response.Ok(res))
    .catch(next);
  }
);

module.exports = router;
