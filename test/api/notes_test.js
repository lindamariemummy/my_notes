// grunt test runs of different database (notes_test)
process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('basic notes/users tests', function() {
  var id1, id2, jwt, loginJSON = {email: 'medhj3', password: 'foobar123'};
  it('should not be able to do anything without authentication', function(done) {
    //chai.request('https://fathomless-refuge-1297.herokuapp.com')
    chai.request('http://localhost:3000')
    .post('/api/notes')
    .send({noteBody: 'hi', noteAuthor: 'me'})
    .end(function(err, res) {
      //console.log(res);
      expect(res.statusCode).to.eql(403);
      done();
    });
  });
  it('should refuse to create a new user with a short PW', function(done) {
    //chai.request('https://fathomless-refuge-1297.herokuapp.com')
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: "hi", password: "123"})
    .end(function(err, res) {
      //console.log(err);
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(500);
      done();
    });
  });
  it('should be able to create a new user', function(done) {
    //chai.request('https://fathomless-refuge-1297.herokuapp.com')
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send(loginJSON)
    .end(function(err, res) {
      //console.log(err);
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.property('jwt');
      jwt = res.body.jwt;
      expect(jwt).to.be.a('string');
      done();
    });
  });
  it('should be able to get a token for an existing user', function(done) {
    //chai.request('https://fathomless-refuge-1297.herokuapp.com')
    chai.request('http://localhost:3000')
    .get('/api/users')
    .auth(loginJSON.email, loginJSON.password)
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log(res);
      expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.property('jwt');
      jwt = res.body.jwt;
      expect(jwt).to.be.a('string');
      done();
    });
  });
  it('should be able to save a note', function(done) {
    chai.request('http://localhost:3000')
    //chai.request('https://fathomless-refuge-1297.herokuapp.com')
    .post('/api/notes')
    .set({'jwt':jwt})
    .send({noteBody: 'hi', noteAuthor: 'me'})
    .end(function(err, res) {
      //console.log(res);
      expect(res.statusCode).to.eql(200);
      done();
    });
  });
  it('should be able to get an index', function(done) {
    chai.request('http://localhost:3000')
    //chai.request('https://fathomless-refuge-1297.herokuapp.com')
    .get('/api/notes')
    .set({'jwt':jwt})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.be.true;
      id1 = res.body[1]._id;
      id2 = res.body[2]._id;
      //console.log("id1", id1);
      done();
    });
  });
  it('should be able to get a single note', function(done) {
    chai.request('http://localhost:3000')
    //chai.request('https://fathomless-refuge-1297.herokuapp.com')
    .get('/api/notes/' + id1)
    .set({'jwt':jwt})
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log(res.body.noteBody)
      expect(res.body.noteBody).to.eql('Hello I am a new note');
      done();
    });
  });
  it('should be able to update a note', function(done) {
    chai.request('http://localhost:3000')
    //chai.request('https://fathomless-refuge-1297.herokuapp.com')
    .put('/api/notes/' + id2)
    .set({'jwt':jwt})
    .send({noteBody: 'new note', noteAuthor: 'Linda'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('new note');
      done();
    });
  });
    it('should be able to delete a user', function(done) {
    chai.request('http://localhost:3000')
    //chai.request('https://fathomless-refuge-1297.herokuapp.com')
    .delete('/api/users')
    .set({'jwt':jwt})
    .send(loginJSON)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done();
    });
  });
  /*it('should be able to get a single note', function(done) {
    chai.request('http://localhost:3000')
    //chai.request('https://fathomless-refuge-1297.herokuapp.com')
    .get('/api/notes/' + id)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('new note');
      done();
    });
  });
  it('should be able to destroy a note', function(done) {
    chai.request('http://localhost:3000')
    //chai.request('https://fathomless-refuge-1297.herokuapp.com')
    .delete('/api/notes/' + id)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
      done();
    });
  });*/
});
