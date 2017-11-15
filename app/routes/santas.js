var express = require('express');
var router = express.Router();
var passport = require('passport');

var Santa = require('../models/santa');
var User = require('../models/user');

router.post('/recipient', function (req, res) {
  if (req.isAuthenticated()) {
    Santa.findOne({
      'from': req.user._id
    }, function (err, santa) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      if (santa) {
        res.json(santa);
      } else {
        this.getRandomUserForSanta(req.user, function (err, user) {
          if (err) {
            return res.status(500).json({
              err: err
            });
          }
          if (user) {
            Santa.create({
              from: req.user._id,
              to: user._id
            }, function (err, recipient) {
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
          }
        });
        // User.find(function (err, users) {
        //   if (err) {
        //     return res.status(500).json({
        //       err: err
        //     });
        //   }
        //   if (users) {
        //     Santa.create({
        //       from: req.user._id,
        //       to: users[1]._id
        //     }, function (err, recipient) {
        //       if (err) {
        //         return res.status(500).json({
        //           err: err
        //         });
        //       }
        //       if (recipient) {
        //         return res.status(200).json({
        //           recipient: recipient
        //         });
        //       }
        //     });
        //   }
        // });
      }
    });
  }
});

function getRandomUserForSanta(satna, callback) {
  User.find({
    _id: {
      $ne: santa._id
    }
  }, function (err, users) {
    if (err) {
      callback(err);
    }
    if (users) {
      if (users.length > 1) {
        do {
          var user = items[Math.floor(Math.random() * users.length)];
        } while (user.couple !== santa._id);
      } else {
        user = users[0];
      }
      callback({}, user);
    }
  });
}

module.exports = router;