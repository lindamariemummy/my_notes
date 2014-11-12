'use strict';

//passport-http authenticates http requests
//"The HTTP Basic authentication strategy authenticates requests based on
//userid and password credentials contained in the `Authorization` header
//field."
var BasicStrategy = require('passport-http').BasicStrategy;

//require User schema
var User = require('../models/user');

module.exports = function(passport) { //first param is options second is callback
	passport.use('basic', new BasicStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done) {
		User.findOne({'basic.email': email}, function(err, data){
			if (err) return res.status(500).send('server error!');

			if (!user) return done('access error');

			if (!user.validPassword(password)) return done('access error');

			return done(null, user);
		});
	}));
};