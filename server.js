var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var passport = require('passport');
var app = express();

// connect to mongoose
var mongodbUri = 'mongodb://heroku_app31292297:hfvmdkr6ndssg4cbimge6oinam@ds051740.mongolab.com:51740/heroku_app31292297';
mongoose.connect(mongodbUri);

//use bodyparser middleware
app.use(bodyparser.json());

//sets variables within the program (can be retrieved with app.get())
app.set('jwtSecret', process.env.JWT_SECRET || 'changethis');
app.set('secret', process.env.SECRET || 'definitelychangethis');
//console.log(app.get('jwtSecret'));

//use passport middleware
app.use(passport.initialize());

//calls passport module we wrote in class with passport module as parameter
require('./lib/passport')(passport)

//passes in the secret to decode the jwt
var jwtauth = require('./lib/jwt_auth')(app.get('jwtSecret'));

require('./routes/users_routes')(app, passport);
require('./routes/notes_routes')(app, jwtauth);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server running on port: %d', app.get('port'));
});


// superagent http://localhost:3000/api/users POST '{"email":"test@example.com", "password":"foo"}'

//curl -u test@example.com:foo http://localhost:3000/api/users