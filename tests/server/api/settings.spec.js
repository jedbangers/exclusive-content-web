'use strict';

const _           = require('lodash');
const expect      = require('chai').expect;
const APISettings = require('../../../server/settings');

describe('API settings', function() {

  describe('Admin', function() {
    it('Exposed paths should be "_id" and "email"', function() {
      const paths = [ '_id', 'email' ];
      expect(_.difference(APISettings.Admin.paths, paths)).to.be.empty;
      expect(_.difference(paths, APISettings.Admin.paths)).to.be.empty;
    });

    it('List should be sorted in ascending order by "email"', function() {
      expect(APISettings.Admin.sort).to.have.keys([ 'email' ]);
      expect(APISettings.Admin.sort.email).and.equal('asc');
    });
  });

  describe('ContentCode', function() {
    it('Exposed paths should be "_id", "name", "code" and "content"', function() {
      const paths = [ '_id', 'name', 'description', 'imageUrl', 'code', 'content' ];
      expect(_.difference(APISettings.ContentCode.paths, paths)).to.be.empty;
      expect(_.difference(paths, APISettings.ContentCode.paths)).to.be.empty;
    });

    it('List should be sorted in ascending order by "name"', function() {
      expect(APISettings.ContentCode.sort).to.have.keys([ 'name' ]);
      expect(APISettings.ContentCode.sort.name).and.equal('asc');
    });
  });

});
