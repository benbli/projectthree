var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var User = require('../models/user');


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Get all textbooks
router.get('/', function(req, res){
  if (req.query.college){
    Book.find({college: req.query.college}, function(err, databaseTextbooks){
      res.json({textbooks: databaseTextbooks})
    })
  } else if (req.query.user){
    Book.find({user_id: req.query.user}, function(err, databaseTextbooks){
      res.json({user_id: databaseTextbooks})
    })
  } else {
    Book.find({}, function(err, databaseTextbooks){
      res.json({databaseTextbooks})
    })
  }
});

// Create Textbook
router.post('/', function(req, res){
  debugger
  var bookData = req.body;
  var newBook = new Book(bookData);
  newBook.save(function(err, databaseBook){
    debugger;
    res.json(databaseBook);
  })
})

router.post('/', function(req, res){
  var userData = req.body.user;  // data sent
  var newUser = new User(userData);  // make a new user using the data sent
    // may look like: req.body.user = {username: 'lichard', password: '1234'}
  newUser.save(function(err, databaseUser){  // save user to the database
    res.json(databaseUser);
  });
});

// Get one textbook
router.get('/:id', function(req, res){
  var textbookId = req.params.id;
  console.log('user id: ', textbookId);
  User.findOne({'textbooks._id' : textbookId}, function(err, databaseUser){
    var databaseTextbook = databaseUser.textbooks.id(textbookId);
    console.log('textbook return: ', databaseTextbook);
    res.json(databaseTextbook)
  })
})

// Update the textbook to sold
router.patch('/', function(req, res){
  if(req.body['status']){
    var textbookId = req.params.id;
    User.findOne({'textbooks._id' : textbookId}, function(err, databaseUser){
      var databaseTextbook = databaseUser.textbooks.id(textbookId);
      Book.findByIdAndUpdate(textbookId, {new : true}, function(err, databaseTextbook){
        res.json(databaseTextbook);
      });
    })
  }
});

module.exports = router;
