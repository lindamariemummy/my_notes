'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var userSchema = mongoose.Schema({
  basic: {
    email: String,
    password: String
  }
});

userSchema.methods.generateHash = function(password) {
	//uses syncronous function (unusual in node)
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	// first param: password user typed in
	// 2nd param: will behashed password stored in db

	return bcrypt.compareSync(password, this.basic.password);
};

//userSchema.path('password').validate(function (password) {
//  return password.length >= 8;
//}, 'password not long enough');

//the ID from the mongo database is what's passed back and forth
userSchema.methods.generateToken = function(secret) {
	var self = this;
	var expiration = Date.now() + 600000; //token expires in 10 minutes
	//console.log("expires:", expiration);
	var token = jwt.encode({
		iss: self._id, //aka ID
		exp: expiration.toString(), //add issue date
		adm: true //can be changed if the user is an admin
	}, secret);
	return token;
};

module.exports = mongoose.model('User', userSchema);