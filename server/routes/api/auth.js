'use strict';

var express  = require('express');
var Response = require('../../utils/response');
var Auth     = require('../../utils/auth');

var router = express.Router();

router.get('/me', Auth.ensureAuthenticated, function(req, res){
  Response.Ok(res)(req.session.user);
});

router.post('/login', Auth.authenticate);

router.post('/logout', Auth.logout, function(req, res){
  Response.NoContent(res)();
});

module.exports = router;
