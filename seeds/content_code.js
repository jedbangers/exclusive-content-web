'use strict';

const _           = require('lodash');
const Bluebird    = require('bluebird');
const chance      = require('chance').Chance();
const Log         = require('../server/utils/log');
const ContentCode = require('../server/model/content_code');

module.exports = {

  seed(n) {
    return Bluebird.all(_.times(n, () => {

      const contentCode = new ContentCode({
        name: chance.sentence({ words: 5 }),
        content: {
          url: chance.url({ domain: 'seed.dev' })
        }
      });

      return contentCode.saveAsync()
      .then(function(cc) {
        Log.info(`ContentCode ${cc._id} added with name: "${cc.name}".`);
        return cc;
      });
    }));
  }

};
