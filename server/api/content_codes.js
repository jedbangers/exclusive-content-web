'use strict';

const _           = require('lodash');
const Bluebird    = require('bluebird');
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

router.get('/latest', (req, res, next) => {
  ContentCode.findAsync()
  .then((contentCodes) => _.sortBy(contentCodes, (cc) => 1 - cc._id.getTimestamp()))
  .then(_.first)
  .then(Response.Ok(res))
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
  (req, res, next) => {
    Bluebird.try(() => req.fetchedContentCode.toObject())
    .then(Response.Ok(res))
    .catch(next);
  }
);

router.post('/', (req, res, next) => {
  const cc = new ContentCode(_.omit(req.body, 'code'));
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
    Bluebird.try(() => {
      // Merge 'content' properties from body to persistent object
      let content      = req.fetchedContentCode.content;
      const newContent = req.body.content;

      // Calculate items to be added and remove them from incoming array.
      const itemsToBeAdded = _.filter(newContent, (item) => !item._id);
      _.remove(newContent, (item) => !item._id);

      // Index both contents by _id
      content = _.indexBy(content, '_id');
      const newContentIndexed = _.indexBy(_.filter(newContent, (item) => item._id), '_id');

      // Merge them
      _.merge(content, newContentIndexed);

      // Un-index content
      content = _.values(content);

      // Remove items to be deleted
      _.remove(content, (item) => !newContentIndexed[item._id.toString()]);

      // Add new items
      content = content.concat(itemsToBeAdded);

      // Update content
      req.fetchedContentCode.content = content;

      // Update the rest of the properties
      const updateObj = _.omit(req.body, 'code', 'content');
      _.merge(req.fetchedContentCode, updateObj);

      return req.fetchedContentCode.saveAsync();
    })
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
