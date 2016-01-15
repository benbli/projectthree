var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res){
  User.find({}, function(err, databaseUsers){
    res.json({users: databaseUsers});
  });
});

router.post('/', function(req, res){
  var userData = req.body.user;  // data sent
  var newUser = new User(userData);  // make a new user using the data sent
    // may look like: req.body.user = {username: 'lichard', password: '1234'}
  newUser.save(function(err, databaseUser){  // save user to the database
    res.json(databaseUser);
  });
});


router.post('/authenticate', function(req, res){      // POST to /api/users/authenticate
  console.log("trying to authenticateeeee with TOKEN");
  var usernameTry = req.body.username;
  var passwordTry = req.body.password;
  // find user by username
  User.findOne({ username: usernameTry }, function(err, databaseUser){
    databaseUser.authenticate(passwordTry, function(err, isMatch){
      if(isMatch){
        databaseUser.setToken(function(){
          res.json({description: "Correct Password!!!", token: databaseUser.token });  // send token as json
        });
      } else {
        res.json({description: "Sorry, wrong passwordddd", status: 302});
      }
    });
  });
});

router.delete('/', function(req, res){
  console.log("logging outtttt");
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username}, function(databaseUser){
    databaseUser.deleteToken();
  });
});

module.exports = router;