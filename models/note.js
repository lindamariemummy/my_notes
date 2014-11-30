var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
  noteBody: 'String',
  noteAuthor: 'String'
});

var Notes = mongoose.model('Note', noteSchema);

module.exports = mongoose.model('Note', noteSchema);