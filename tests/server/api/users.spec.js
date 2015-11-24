'use strict';

require('../../../server/bin/context');

const _               = require('lodash');
const mongoose        = require('mongoose');
const request         = require('supertest');
const expect          = require('chai').expect;
const App             = require('../../../server/app');
const Admin           = require('../../../server/model/admin');
const AdminSeed       = require('../../../seeds/admin');
const AdminSettings   = require('../../../server/settings').Admin;
const TestUtils       = require('../../../tests/utils');
const SuperAgentUtils = require('../superagent_utils');

const server = request(App.server.https);
const agent  = request.agent(App.server.https);

const agentUtils = new SuperAgentUtils(agent);

function performLogin(admin, password) {
  return server
  .post('/api/auth/login')
  .send({
    email: admin.email,
    password
  })
  .endAsync()
  .then(agentUtils.saveJWT.bind(agentUtils));
}

describe('/api/admins', function() {

  describe('GET', function() {

    const adminsToSeed = 10;
    TestUtils.seedingTimeout(this, adminsToSeed);

    let seededAdmins;

    before(function(done) {
      App.setup()
      .then(() => {
        return Admin.removeAsync();
      })
      .then(() => {
        return AdminSeed.seed(adminsToSeed);
      })
      .then(_.partialRight(TestUtils.prepareSeededObjects, AdminSettings.paths, function(item) { return item.email; }))
      .then((seeded) => {
        seededAdmins = seeded;
        return performLogin(_.first(seeded), 'test');
      })
      .then(() => {
        done();
      })
      .catch(done);
    });

    after(function(done) {
      Admin.removeAsync()
      .then(() => {
        done();
      })
      .catch(done);
    });

    it('/ should return admin list', function(done) {
      agentUtils.withJWT(server.get('/api/admins'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(seededAdmins);
        done();
      })
      .catch(done);
    });

    it('?skip=4 should return admin list skipping the first four admins', function(done) {
      agentUtils.withJWT(server.get('/api/admins?skip=4'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(_.slice(seededAdmins, 4));
        done();
      })
      .catch(done);
    });

    it('?skip=invalid_skip_param should return admin list without skipping anything', function(done) {
      agentUtils.withJWT(server.get('/api/admins?skip=invalid_skip_param'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(seededAdmins);
        done();
      })
      .catch(done);
    });

    it('?limit=4 should return the first four admins', function(done) {
      agentUtils.withJWT(server.get('/api/admins?limit=4'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(_.slice(seededAdmins, 0, 4));
        done();
      })
      .catch(done);
    });

    it('?limit=invalid_limit_param should return all admins', function(done) {
      agentUtils.withJWT(server.get('/api/admins?limit=invalid_limit_param'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(seededAdmins);
        done();
      })
      .catch(done);
    });

    it('/:id should return admin with _id = :id', function(done) {
      const admin = _.first(seededAdmins);
      agentUtils.withJWT(server.get(`/api/admins/${admin._id}`))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        TestUtils.assertObjectIds(admin._id, res.body._id);
        TestUtils.assertUnorderedArrays(_.keys(res.body), AdminSettings.paths);
        done();
      })
      .catch(done);
    });

    it('/total should return total admin list size', function(done) {
      agentUtils.withJWT(server.get('/api/admins/total'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.eql({ total: seededAdmins.length });
        done();
      })
      .catch(done);
    });

    it('/:not_found_id should respond with 404', function(done) {
      agentUtils.withJWT(server.get(`/api/admins/${mongoose.Types.ObjectId()}`))
      .expect(404)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.eql(AdminSettings.errors.notFound);
        done();
      })
      .catch(done);
    });

    it('/:invalid_id should respond with 400', function(done) {
      agentUtils.withJWT(server.get('/api/admins/powerfromhell'))
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.eql(AdminSettings.errors.invalidId);
        done();
      })
      .catch(done);
    });

  });

  describe('POST', function() {

    const adminsToSeed = 1;
    TestUtils.seedingTimeout(this, adminsToSeed, 3000);

    before(function(done) {
      App.setup()
      .then(() => {
        return Admin.removeAsync();
      })
      .then(() => {
        return AdminSeed.seed(adminsToSeed);
      })
      .then(_.partialRight(TestUtils.prepareSeededObjects, AdminSettings.paths, function(item) { return item.email; }))
      .then((seeded) => {
        return performLogin(_.first(seeded), 'test');
      })
      .then(() => {
        done();
      })
      .catch(done);
    });

    after(function(done) {
      Admin.removeAsync()
      .then(() => {
        done();
      })
      .catch(done);
    });


    it('/ should create a new admin', function(done) {
      agentUtils.withJWT(server.post('/api/admins'))
      .send({
        email    : 'rudimentary@peni.com',
        password : 'rudimentarypassword'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(() => {
        Admin.findByAdminnameAsync('rudimentary@peni.com')
        .then((admin) => {
          expect(admin).to.be.instanceof(Object);
          expect(admin.email).to.eql('rudimentary@peni.com');
          done();
        });
      })
      .catch(done);
    });

    it('/ should fail creation of a admin with an already-existing email', function(done) {
      agentUtils.withJWT(server.post('/api/admins'))
      .send({
        email: 'rudimentary@peni.com',
        password: 'rudimentarypassword'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        let error = AdminSettings.errors.email.unique;
        error = error.replace('%s', 'email');
        error = error.replace('%s', 'rudimentary@peni.com');
        expect(res.body.message).to.be.eql(error);
        done();
      })
      .catch(done);
    });

    it('/ (no email) should fail', function(done) {
      agentUtils.withJWT(server.post('/api/admins'))
      .send({
        password: 'rudimentarypassword'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        let error = AdminSettings.errors.email.required;
        error = error.replace('%s', 'email');
        expect(res.body.message).to.be.eql(error);
        done();
      })
      .catch(done);
    });

    it('/ (no password) should fail', function(done) {
      agentUtils.withJWT(server.post('/api/admins'))
      .send({
        email: 'musta@paraati.com'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body.message).to.be.eql(AdminSettings.errors.passwordMissing);
        done();
      })
      .catch(done);
    });

  });

});
