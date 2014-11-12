'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var userSchema = mongoose.Schema({
  basic: {
    email: 'String',
    password: 'String'
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

userSchema.methods.generateToken = function(secret) {
	var self = this;
	var token = jwt.encode({
		iss: self._id //aka ID
	}, secret);
	return token;
};

module.exports = mongoose.model('User', userSchema);