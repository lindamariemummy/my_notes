'use strict';
var jwt = require('jwt-simple');
var User = require('../models/user.js')

module.exports = function(secret) {
	return function(req, res, next) {

		//reads the token off the request, we will store the jwt token in the header
		var token = req.headers.jwt || req.body.jwt;

		var decoded;

		try {
			//turns jwt from (hex?) string to object
			decoded = jwt.decode(token, secret);
		}
		catch (err) { //use catch because jwt-simple doesn't support callbacks
			console.log(err); //this executes if token is incorrect
			return res.status(403).send('access denied');
		}

		// next, see if user exists (put timestamp check here

		User.findOne({'_id': decoded.iss}, function(err, data) {
			if (err) return res.status(403).send('access denied');
			if (!user) return res.status(403).send('access denied');
			if (user && !user.validPassword()) res.status(403).send('access denied');
			req.user = data;

			//calls next middleware function, in this case
			next();

		});
	};
};