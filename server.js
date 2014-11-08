var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var app = express();

app.use(bodyparser.json());


//code from https://github.com/mongolab/mongodb-driver-examples/blob/
// master/nodejs/mongooseSimpleExample.js
var mongodbUri = 'mongodb://heroku_app31292297:hfvmdkr6ndssg4cbimge6oinam@ds051740.mongolab.com:51740/heroku_app31292297';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
mongoose.connect(mongooseUri, options);



//mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/notes_development');

require('./routes/notes_routes')(app);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server running on port: %d', app.get('port'));
});
