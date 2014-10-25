'use strict';

require('../../../server/run');

var _               = require('lodash');
var bb              = require('bluebird');
var mongoose        = require('mongoose');
var request         = require('supertest');
var expect          = require('chai').expect;
var App             = require('../../../server/app');
var User            = require('../../../server/model/user');
var UserSeed        = require('../../../seeds/user');
var UserSettings    = require('../../../server/routes/api/settings').user;
var TestUtils       = require('../../../tests/utils');
var SuperAgentUtils = require('../superagent_utils');

bb.promisifyAll(request);

var server = request(App.server.https);
var agent  = request.agent(App.server.https);

var AgentUtils = new SuperAgentUtils(agent);

var performLogin = function(user, password){
  return server
  .post('/api/auth/login')
  .send({
    email: user.email,
    password: password
  })
  .endAsync()
  .then(AgentUtils.saveCookies);
};

describe('/api/users', function(){

  describe('GET', function(){

    // Increase default timeout to let user seed do its work.
    var usersToSeed = 10;
    TestUtils.seedingTimeout(this, usersToSeed);

    var seededUsers;

    before(function(done){
      App.setup()
      .thenReturn(User.removeAsync())
      .thenReturn(UserSeed.seed(usersToSeed))
      .then(_.partialRight(TestUtils.prepareSeededObjects, UserSettings.paths, function(item){ return item.email; }))
      .then(function(seeded){
        seededUsers = seeded;
        return performLogin(_.first(seeded), 'test');
      })
      .then(function(res){
        done();
      })
      .catch(done);
    });

    it('/ should return user list', function(done){
      AgentUtils.withCookies(server.get('/api/users'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        expect(res.body).to.be.eql(seededUsers);
        done();
      })
      .catch(done);
    });

    it('?skip=4 should return user list skipping the first four users', function(done){
      AgentUtils.withCookies(server.get('/api/users?skip=4'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        expect(res.body).to.be.eql(_.rest(seededUsers, 4));
        done();
      })
      .catch(done);
    });

    it('?skip=invalid_skip_param should return user list without skipping anything', function(done){
      AgentUtils.withCookies(server.get('/api/users?skip=invalid_skip_param'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        expect(res.body).to.be.eql(seededUsers);
        done();
      })
      .catch(done);
    });

    it('?limit=4 should return the first four users', function(done){
      AgentUtils.withCookies(server.get('/api/users?limit=4'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        expect(res.body).to.be.eql(_.first(seededUsers, 4));
        done();
      })
      .catch(done);
    });

    it('?limit=invalid_limit_param should return all users', function(done){
      AgentUtils.withCookies(server.get('/api/users?limit=invalid_limit_param'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        expect(res.body).to.be.eql(seededUsers);
        done();
      })
      .catch(done);
    });

    it('/:id should return user with _id = :id', function(done){
      var user = _.first(seededUsers);
      AgentUtils.withCookies(server.get('/api/users/' + user._id))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        TestUtils.assertObjectIds(user._id, res.body._id);
        TestUtils.assertUnorderedArrays(_.keys(res.body), UserSettings.paths);
        done();
      })
      .catch(done);
    });

    it('/total should return total user list size', function(done){
      AgentUtils.withCookies(server.get('/api/users/total'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        expect(res.body).to.eql({ total: seededUsers.length });
        done();
      })
      .catch(done);
    });

    it('/:not_found_id should respond with 404', function(done){
      AgentUtils.withCookies(server.get('/api/users/' + mongoose.Types.ObjectId()))
      .expect(404)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.eql(UserSettings.errors.notFound);
        done();
      })
      .catch(done);
    });

    it('/:invalid_id should respond with 400', function(done){
      AgentUtils.withCookies(server.get('/api/users/powerfromhell'))
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.eql(UserSettings.errors.invalidId);
        done();
      })
      .catch(done);
    });

  });

  describe('POST', function(){

    before(function(done){
      App.setup()
      .thenReturn(User.removeAsync())
      .thenReturn(UserSeed.seed(1))
      .then(_.partialRight(TestUtils.prepareSeededObjects, UserSettings.paths, function(item){ return item.email; }))
      .then(function(seeded){
        return performLogin(_.first(seeded), 'test');
      })
      .then(function(res){
        done();
      })
      .catch(done);
    });

    it('/ should create a new user', function(done){
      AgentUtils.withCookies(server.post('/api/users'))
      .send({
        email: 'rudimentary@peni.com',
        password: 'rudimentarypassword'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        User.findByUsernameAsync('rudimentary@peni.com')
        .then(function(user){
          expect(user).to.be.instanceof(Object);
          expect(user.email).to.eql('rudimentary@peni.com');
          done();
        });
      })
      .catch(done);
    });

    it('/ should fail creation of a user with an already-existing email', function(done){
      AgentUtils.withCookies(server.post('/api/users'))
      .send({
        email: 'rudimentary@peni.com',
        password: 'rudimentarypassword'
      })
      .expect(500)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        var error = UserSettings.errors.email.unique;
        error = error.replace('%s', 'email');
        error = error.replace('%s', 'rudimentary@peni.com');
        expect(res.body.message).to.be.eql(error);
        done();
      })
      .catch(done);
    });

    it('/ (no email) should fail', function(done){
      AgentUtils.withCookies(server.post('/api/users'))
      .send({
        password: 'rudimentarypassword'
      })
      .expect(500)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        var error = UserSettings.errors.email.required;
        error = error.replace('%s', 'email');
        expect(res.body.message).to.be.eql(error);
        done();
      })
      .catch(done);
    });

    it('/ (no password) should fail', function(done){
      AgentUtils.withCookies(server.post('/api/users'))
      .send({
        email: 'musta@paraati.com'
      })
      .expect(500)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(function(res){
        expect(res.body.message).to.be.eql(UserSettings.errors.passwordMissing);
        done();
      })
      .catch(done);
    });

  });

});
