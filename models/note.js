var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
  noteBody: 'String',
  noteAuthor: 'String'
});

var Notes = mongoose.model('Note', noteSchema);


//thanks to the Mongoose validation docs:
// http://mongoosejs.com/docs/2.7.x/docs/validation.html
//noteSchema.path('noteAuthor').validate(function (v) {
//  return v == "Linda";
//}, 'not by Linda');

module.exports = mongoose.model('Note', noteSchema);