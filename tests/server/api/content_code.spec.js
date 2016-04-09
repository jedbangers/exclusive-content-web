'use strict';

require('../../../server/bin/context');

const _               = require('lodash');
const mongoose        = require('mongoose');
const request         = require('supertest');
const expect          = require('chai').expect;
const App             = require('../../../server/app');
const Admin           = require('../../../server/model/admin');
const ContentCode     = require('../../../server/model/content_code');
const AdminSeed       = require('../../../seeds/admin');
const ContentCodeSeed = require('../../../seeds/content_code');
const Settings        = require('../../../server/settings');
const TestUtils       = require('../../../tests/utils');
const SuperAgentUtils = require('../superagent_utils');

const server     = request(App.server.https);
const agent      = request.agent(App.server.https);
const agentUtils = new SuperAgentUtils(agent, {
  login: {
    url: '/api/auth/login',
    usernameField: 'email'
  }
});

describe('/api/contentCodes', function() {

  describe('GET', function() {

    const toSeed = 10;
    TestUtils.seedingTimeout(this, toSeed);

    let contentCodes;

    before(() => App.setup());
    before(() => {
      return Admin.removeAsync()
      .then(() => AdminSeed.seed(1).then(_.first))
      .then((adminSeeded) => agentUtils.performLogin(adminSeeded.email, 'test'));
    });

    before(() => {
      return ContentCode.removeAsync()
      .then(() => ContentCodeSeed.seed(toSeed))
      .then((contentCodesSeeded) => {

        // Dont know why this is not 'prepareSeededObjects'ing content for each ContentCode.
        // Tried with map with no luck either.
        // Maybe it has to do with Mongoose not making it possible to assign
        // to a property of a Mongoosified object, but don't really know.
        // _.forEach(contentCodesSeeded, (cc) => {
        //   const aaa = TestUtils.prepareSeededObjects(cc.content, Settings.Content.paths);
        //   cc.content = aaa;
        //   return cc;
        // });

        contentCodes = TestUtils.prepareSeededObjects(
          contentCodesSeeded,
          Settings.ContentCode.paths,
          (item) => item.name
        );

        // Hack due to problem avoid
        _.forEach(contentCodes, (cc) => {
          _.forEach(cc.content, (content) => {
            content._id = content._id.toString();
          });
        });

      });
    });

    it('/ should return content code list', function() {
      return agentUtils.withCookies(server.get('/api/contentCodes'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(contentCodes);
      });
    });

    it('?skip=4 should return content code list skipping the first four content codes', function() {
      return agentUtils.withCookies(server.get('/api/contentCodes?skip=4'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(_.slice(contentCodes, 4));
      });
    });

    it('?skip=invalid_skip_param should return content code list without skipping anything', function() {
      return agentUtils.withCookies(server.get('/api/contentCodes?skip=invalid_skip_param'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(contentCodes);
      });
    });

    it('?limit=4 should return the first four content codes', function() {
      return agentUtils.withCookies(server.get('/api/contentCodes?limit=4'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(_.slice(contentCodes, 0, 4));
      });
    });

    it('?limit=invalid_limit_param should return all content codes', function() {
      return agentUtils.withCookies(server.get('/api/contentCodes?limit=invalid_limit_param'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(contentCodes);
      });
    });

    it('/:id should return content code with _id = :id', function() {
      const cc = _.first(contentCodes);
      return agentUtils.withCookies(server.get(`/api/contentCodes/${cc._id}`))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        TestUtils.assertObjectIds(cc._id, res.body._id);
        TestUtils.assertUnorderedArrays(_.keys(res.body), _.without(Settings.ContentCode.paths));
      });
    });

    it('/total should return total content code list size', function() {
      return agentUtils.withCookies(server.get('/api/contentCodes/total'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.eql({ total: contentCodes.length });
      });
    });

    it('/:not_found_id should respond with 404', function() {
      return agentUtils.withCookies(server.get(`/api/contentCodes/${mongoose.Types.ObjectId()}`))
      .expect(404)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.eql('Resource not found');
      });
    });

    it('/:invalid_id should respond with 400', function() {
      return agentUtils.withCookies(server.get('/api/contentCodes/powerfromhell'))
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.eql('Invalid ID');
      });
    });

    it('/code/:code should return content code with _id = :id without its "content"', function() {
      const cc = _.first(contentCodes);
      return agentUtils.withCookies(server.get(`/api/contentCodes/code/${cc.code}`))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        TestUtils.assertObjectIds(cc._id, res.body._id);
        expect(res.body.content).to.be.undefined;
        TestUtils.assertUnorderedArrays(_.keys(res.body), [ '_id', 'name', 'code' ]);
      });
    });

    it('/code/:not_found_code should respond with 404', function() {
      return agentUtils.withCookies(server.get(`/api/contentCodes/code/gorement`))
      .expect(404)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.eql('Resource not found');
      });
    });

  });

  describe('POST', function() {

    TestUtils.seedingTimeout(this, 1, 3000);

    before(() => App.setup());
    before(() => ContentCode.removeAsync());
    before(() => {
      return Admin.removeAsync()
      .then(() => AdminSeed.seed(1).then(_.first))
      .then((adminSeeded) => agentUtils.performLogin(adminSeeded.email, 'test'));
    });

    it('/ should create a new content code', function() {
      const obj = {
        name : 'A content code',
        content: [
          { title: 'test content', url: 'http://www.test.com/contenturl' }
        ]
      };
      return agentUtils.withCookies(server.post('/api/contentCodes'))
      .send(obj)
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        // Omit _id property from 'content' array
        res.body.content = _.map(res.body.content, (c) => _.omit(c, '_id'));

        expect(res.body).to.be.eql(_.merge(obj, {
          _id: res.body._id,
          code: res.body.code
        }));
      });
    });

    it('/ (given custom code) should create a new content code disregarding any given code', function() {
      const obj = {
        name : 'A content code',
        code : '82743985743h52k3j4h',
        content: [
          { title: 'test content', url: 'http://www.test.com/contenturl' }
        ]
      };
      return agentUtils.withCookies(server.post('/api/contentCodes'))
      .send(obj)
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        // Omit _id property from 'content' array
        res.body.content = _.map(res.body.content, (c) => _.omit(c, '_id'));

        expect(res.body).to.be.eql(_.merge(obj, {
          _id: res.body._id,
          code: res.body.code
        }));
      });
    });

    it('/ (no body) should fail', function() {
      return agentUtils.withCookies(server.post('/api/contentCodes'))
      .send()
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body.name).to.be.eql('ValidationError');
        expect(_.keys(res.body.errors)).to.have.length(1);
        expect(res.body.errors['name']).not.to.be.empty;
        expect(res.body.errors['name'].message).to.be.eql(Settings.ContentCode.errors.name.required);
      });
    });

    it('/ (empty content object) should fail', function() {
      const obj = {
        name : 'something',
        content: [
          { title: 'test content 1', url: 'http://www.test.com/contenturl1' },
          {},
          { title: 'test content 2', url: 'http://www.test.com/contenturl2' }
        ]
      };
      return agentUtils.withCookies(server.post('/api/contentCodes'))
      .send(obj)
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body.name).to.be.eql('ValidationError');
        expect(_.keys(res.body.errors)).to.have.length(2);
        expect(res.body.errors['content.1.title']).not.to.be.empty;
        expect(res.body.errors['content.1.url']).not.to.be.empty;
        expect(res.body.errors['content.1.title'].message).to.be.eql(Settings.Content.errors.title.required);
        expect(res.body.errors['content.1.url'].message).to.be.eql(Settings.Content.errors.url.required);
      });
    });

    it('/ (content object with title too long) should fail', function() {
      const obj = {
        name : 'something',
        content: [
          { title: 'test content 1', url: 'http://www.test.com/contenturl1' },
          {
            title: _.times(Settings.Content.values.title.maxLength + 1, () => 'a'),
            url: 'http://www.test.com/contenturl2'
          },
          { title: 'test content 3', url: 'http://www.test.com/contenturl3' }
        ]
      };
      return agentUtils.withCookies(server.post('/api/contentCodes'))
      .send(obj)
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body.name).to.be.eql('ValidationError');
        expect(_.keys(res.body.errors)).to.have.length(1);
        expect(res.body.errors['content.1.title']).not.to.be.empty;
        expect(res.body.errors['content.1.title'].message).to.be.eql(Settings.Content.errors.title.maxLength);
      });
    });

    it('/ (content object with invalid URL) should fail', function() {
      const obj = {
        name : 'something',
        content: [
          { title: 'test content 1', url: 'http://www.test.com/contenturl1' },
          { title: 'test content 2', url: 'not a valid URL!' },
          { title: 'test content 3', url: 'http://www.test.com/contenturl3' }
        ]
      };
      return agentUtils.withCookies(server.post('/api/contentCodes'))
      .send(obj)
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body.name).to.be.eql('ValidationError');
        expect(_.keys(res.body.errors)).to.have.length(1);
        expect(res.body.errors['content.1.url']).not.to.be.empty;
        expect(res.body.errors['content.1.url'].message).to.be.eql(Settings.Content.errors.url.invalid);
      });
    });

    it('/ (content object with invalid imageUrl) should fail', function() {
      const obj = {
        name : 'something',
        content: [
          {
            title    : 'test content',
            imageUrl : 'not a valid URL!',
            url      : 'http://www.test.com/contenturl'
          }
        ]
      };
      return agentUtils.withCookies(server.post('/api/contentCodes'))
      .send(obj)
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body.name).to.be.eql('ValidationError');
        expect(_.keys(res.body.errors)).to.have.length(1);
        expect(res.body.errors['content.0.imageUrl']).not.to.be.empty;
        expect(res.body.errors['content.0.imageUrl'].message).to.be.eql(Settings.Content.errors.imageUrl.invalid);
      });
    });

    it('/ (content object with too long description) should fail', function() {
      const obj = {
        name : 'something',
        content: [
          {
            title       : 'test content',
            url         : 'http://www.test.com/contenturl',
            description : _.times(Settings.Content.values.description.maxLength + 1, () => 'c').join('')
          }
        ]
      };
      return agentUtils.withCookies(server.post('/api/contentCodes'))
      .send(obj)
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body.name).to.be.eql('ValidationError');
        expect(_.keys(res.body.errors)).to.have.length(1);
        expect(res.body.errors['content.0.description']).not.to.be.empty;
        expect(res.body.errors['content.0.description'].message).to.be.eql(
          Settings.Content.errors.description.maxLength
        );
      });
    });

  });

});
