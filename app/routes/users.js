var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var ObjectId = mongoose.mongo.ObjectId;

var User = require('../models/user');

router.post('/register', function(req, res) {
  User.register(new User({
    username: req.body.username,
    couple: new ObjectId(),
    name: req.body.name,
    forname: req.body.forname
  }), req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }

    passport.authenticate('local')(req, res, function() {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not get user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

router.get('/currentUser', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      status: "Not authorized"
    });
  }
  res.status(200).json({
    user: req.user
  });
});

router.post('/setCouple', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      status: "Not authorized"
    });
  }
  User.findByIdAndUpdate({
    _id: req.body.user1_id
  }, {
    $set: {
      couple: req.body.user2_id
    }
  }, {
    new: true
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    if (user) {
      User.findByIdAndUpdate({
          _id: req.body.user2_id
        }, {
          $set: {
            couple: req.body.user1_id
          }
        }, {
          new: true
        },
        function(err, user2) {
          if (err) {
            return res.status(500).json({
              err: err
            });
          }
          res.status(200).json({
            users: [user, user2]
          });
        });
    }
  });
});

module.exports = router;
