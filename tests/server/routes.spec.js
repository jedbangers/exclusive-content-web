'use strict';

require('../../server/bin/context');

const request     = require('supertest');
const mongoose    = require('mongoose');
const App         = require('../../server/app');

const server  = request(App.server.http);

describe('/api API must be served over SSL', function() {

  describe('/admins', function() {
    it('GET / should respond with 301 Redirect', function() {
      return server.get('/api/admins').expect(301).endAsync();
    });

    it('GET /:id should respond with 301 Redirect', function() {
      return server.get(`/api/admins/${mongoose.Types.ObjectId()}`).expect(301).endAsync();
    });

    it('GET /total should respond with 301 Redirect', function() {
      return server.get('/api/admins/total').expect(301).endAsync();
    });

    it('POST / should respond with 301 Redirect', function() {
      return server.post('/api/admins').expect(403).endAsync();
    });
  });

  describe('/contentCodes', function() {
    it('GET / should respond with 301 Redirect', function() {
      return server.get('/api/contentCodes').expect(301).endAsync();
    });

    it('GET /:id should respond with 301 Redirect', function() {
      return server.get(`/api/contentCodes/${mongoose.Types.ObjectId()}`).expect(301).endAsync();
    });

    it('GET /code/:code should respond with 301 Redirect', function() {
      return server.get('/api/contentCodes/code/some_code').expect(301).endAsync();
    });

    it('GET /total should respond with 301 Redirect', function() {
      return server.get('/api/contentCodes/total').expect(301).endAsync();
    });

    it('POST / should respond with 301 Redirect', function() {
      return server.post('/api/contentCodes').expect(403).endAsync();
    });
  });

});

describe('/dashboard Dashboard must be served over SSL', function() {

  it('should respond with 301 Redirect', function() {
    return server.get('/dashboard').expect(301).endAsync();
  });

});

