var express = require('express');
var router = express.Router();
var passport = require('passport');

var Santa = require('../models/santa');
var User = require('../models/user');

router.post('/recipient', function(req, res) {
  if (req.isAuthenticated()) {
    Santa.findOne({
      'from': req.user._id
    }, function(err, santa) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      if (santa) {
        res.json(santa);
      } else {
        getRandomUserForSanta(req.user, function(err, user) {
          if (err) {
            return res.status(500).json({
              err: err
            });
          }
          if (user) {
            // return res.status(200).json({
            //   recipient: user
            // });
            Santa.create({
              from: req.user._id,
              to: user._id
            }, function(err, recipient) {
              if (err) {
                return res.status(500).json({
                  err: err
                });
              }
              if (recipient) {
                return res.status(200).json({
                  recipient: recipient
                });
              }
            });
          } else {
            return res.status(500).json({
              err: "User was not found"
            });
          }
        });
      }
    });
  } else {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }
});

function getRandomUserForSanta(santa, callback) {
  Santa.find({
    from: {
      $ne: santa._id
    },
  }, function(err, santas) {
    // searching for users than already have santa
    var haveSanta = [];
    if (santas) {
      haveSanta = santas.map(function(santaFound) {
        return santaFound.to;
      });
    }

    User.find({
        $and: [{
            _id: {
              $ne: santa._id
            }
          },
          {
            _id: {
              $nin: haveSanta
            }
          }
        ]
      },
      function(err, users) {
        if (err) {
          return callback(err);
        }
        if (users) {
          if (users.length > 1) {
            var i = 0;
            var found = false;
            // magic
            do {
              i = i + 1;
              var user = users[Math.floor(Math.random() * users.length)];
              if (user.couple !== santa._id) {
                found = true
              }
            } while (found = false || i < 500);
            // end magic
          } else {
            user = users[0];
          }
          callback(null, user);
        }
      });
  });
}

module.exports = router;
