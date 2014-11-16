'use strict';
var Note = require('../models/note');

module.exports = function(app, auth) {

  //get an index
  app.get('/api/notes', auth, function(req, res) {
    Note.find({}, function(err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

  //get a single note
  app.get('/api/notes/:id', auth, function(req, res) {
    Note.findOne({_id: req.params.id}, function(err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

  //save a note
  app.post('/api/notes', auth, function(req, res) {
    var note = new Note(req.body);
    note.save(function(err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

  //update a note
  app.put('/api/notes/:id', auth, function(req, res) {
    var note = req.body;
    delete note._id;
    Note.findOneAndUpdate({_id: req.params.id}, note, function(err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

  //deletes a note
  app.delete('/api/notes/:id', auth, function(req, res) {
    Note.remove({_id: req.params.id}, function(err) {
      if (err) return res.status(500).send('there was an error');
      res.json({msg: 'success!'});
    });
  });
};
