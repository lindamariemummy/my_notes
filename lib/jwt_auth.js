'use strict';
var jwt = require('jwt-simple');
var User = require('../models/user.js')

module.exports = function(secret) {
	return function(req, res, next) {

		//reads the token off the request
		var token = req.headers.jwt || req.body.jwt;

		var decoded;

		try {
			//turns jwt from (hex?) string to object
			decoded = jwt.decode(token, secret);
		}
		catch (err) { //use catch because jwt-simple doesn't support callbacks
			console.log(err);
			return res.status(403).send('access denied');
		}

		// next, see if user exists
		User.findOne({'_id': decoded.iss}, function(err, user) {
			if (err) return res.status(403).send('access denied');
			if (!user) return res.status(403).send('access denied');
			if (user && !user.validPassword()) res.status(403).send('access denied');
			req.user = user;

			//calls next middleware function, in this case
			next();

		});
	};
};