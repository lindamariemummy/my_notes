'use strict';

var User = require('../models/user');
var checkPassword = require('../lib/checkPassword.js');

module.exports = function(app, passport, jwtadminauth) {
//user login is get request

//create new user is a post request

  //existing users come in here, generates jwt token
  //don't have jwt token, but know password and email
  app.get('/api/users', passport.authenticate('basic', {session: false}),
    //this function overrides the default authentication
    function(req, res) {
      res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
    }
  );

  //creating a new user
  app.post('/api/users', function(req, res) {
    User.findOne({'basic.email': req.body.email}, function(err, user) {
      if (err) return res.status(500).send('server error');

      if (user) return res.status(500).send('cannot create that user');

      var newUser = new User();

      if (!checkPassword(req.body.password)) return res.status(500).send('invalid password');

      newUser.basic.email = req.body.email;
      newUser.basic.password = newUser.generateHash(req.body.password);
      //insert code to make sure password and confirmation password match

      newUser.save(function(err, data) {
        if (err) return res.status(500).send('server error');
        res.json({jwt: newUser.generateToken(app.get('jwtSecret'))});
      });
    });
  });

  app.delete('/api/users', jwtadminauth, function(req, res) {
    User.findOne({'basic.email': req.body.email}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (!user) return res.status(500).send('user not found');

      User.remove({'basic.email': req.body.email}, function(err) {
        if (err) return res.status(500).send('server error');
        return res.status(200).send('user deleted');
      });
    });
  });
};
