'use strict';

const express               = require('express');
const Response              = require('simple-response');
const generalSettingService = require('../services/general_settings_service');

const router = express.Router();

router.put('/', (req, res, next) => {
  generalSettingService.updateSettings(req.body)
  .then(Response.Ok(res))
  .catch(next);
});

module.exports = router;
