'use strict';

require('../server/bin/context');

const _               = require('lodash');
const Bluebird        = require('bluebird');
const config          = require('config');
const Mongootils      = require('mongootils');
const AdminSeed       = require('../seeds/admin');
const Log             = require('../server/utils/log');
const ContentCodeSeed = require('../seeds/content_code');

const adminsToSeed       = process.argv[2] || 3;
const contentCodesToSeed = process.argv[3] || 15;

new Mongootils(config.mongo.uri, config.mongo.options)
.connect()
.then(() => Bluebird.all([
  AdminSeed.seed(adminsToSeed),
  ContentCodeSeed.seed(contentCodesToSeed)
]))
.spread((admins, contentCodes) => {
  Log.info('Finished seeding.');

  _(admins).forEach((admin) => Log.info(`  Admin { _id: ${admin._id}, Email: ${admin.email} }`)).value();
  _(contentCodes).forEach((cc) => Log.info(`  ContentCode { _id: ${cc._id}, Name: ${cc.name} }`)).value();

  process.exit(0);
})
.catch((err) => {
  console.log(err);
  process.exit(1);
});
