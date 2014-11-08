process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('basic notes crud', function() {
  var id;
  it('should be able to create a note with author of Linda', function(done) {
    chai.request('https://fathomless-refuge-1297.herokuapp.com')
    //chai.request('http://localhost:3000')
    .post('/api/notes')
    .send({noteBody: 'new note', noteAuthor: 'Linda'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log(res);
      expect(res.body.noteAuthor).to.eql('Linda');
      expect(res.body).to.have.property('_id');
      id = res.body._id;
      done();
    });
  });
  it('should fail to create a note if author is not Linda', function(done) {
    chai.request('https://fathomless-refuge-1297.herokuapp.com')
    //chai.request('http://localhost:3000')
    .post('/api/notes')
    .send({noteBody: 'Hello I am a new note', noteAuthor: 'Freddy'})
    .end(function(err, res) {
      console.log(res);
      expect(res.statusCode).to.eql(500);
      done();
    });
  });

  it('should be able to get an index', function(done) {
    //chai.request('http://localhost:3000')
    chai.request('https://fathomless-refuge-1297.herokuapp.com')
    .get('/api/notes')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.be.true;
      done();
    });
  });

  it('should be able to get a single note', function(done) {
    //chai.request('http://localhost:3000')
    chai.request('https://fathomless-refuge-1297.herokuapp.com')
    .get('/api/notes/' + id)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('testing notes');
      done();
    });
  });

  it('should be able to update a note', function(done) {
    //chai.request('http://localhost:3000')
    chai.request('https://fathomless-refuge-1297.herokuapp.com')
    .put('/api/notes/' + id)
    .send({noteBody: 'new note', noteAuthor: 'Linda'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('new note');
      done();
    });
  });

  it('should be able to destroy a note', function(done) {
    //chai.request('http://localhost:3000')
    chai.request('https://fathomless-refuge-1297.herokuapp.com')
    .delete('/api/notes/' + id)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
      done();
    });
  });
});
