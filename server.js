var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var passport = require('passport');
var app = express();

// connect to mongoose
//var mongodbUri = //'mongodb://heroku_app31292297:hfvmdkr6ndssg4cbimge6oinam@ds051740.mongolab.com:51740/heroku_app31292297';
//mongoose.connect(mongodbUri);
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/LindaDB');

//use bodyparser middleware for encoded (thanks to Jake for helping me )
app.use(bodyparser.urlencoded({extended:true}));

//use bodyparser middleware
app.use(bodyparser.json());

//sets variables within the program (can be retrieved with app.get())
app.set('jwtSecret', process.env.JWT_SECRET || 'totallysecretsecret');
//app.set('secret', process.env.SECRET || 'definitelychangethis');
//console.log(app.get('jwtSecret'));

//use passport middleware
app.use(passport.initialize());

//calls passport module we wrote in class with passport module as parameter
require('./lib/passport')(passport);

//passes in the secret to decode the jwt
var jwtauth = require('./lib/jwt_auth')(app.get('jwtSecret'));
var jwtadminauth = require('./lib/jwt_admin_auth')(app.get('jwtSecret'));

//var notesRouter = express.Router();
//notesRouter.use(jwtauth);

require('./routes/users_routes')(app, passport, jwtadminauth);
require('./routes/notes_routes')(app, jwtauth);

//now all routes must contain the /v1 path
//app.use('/v1', notesRouter);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server running on port: %d', app.get('port'));
});

// superagent http://localhost:3000/api/users POST '{"email":"test@example.com", "password":"foo"}'

//curl -u test@example.com:foo http://localhost:3000/api/users

//find . -iregex '.*js' ! -iregex '.*node_modules.*' | xargs grep -ni -C 3 'console.log' --color=always | less -RN
