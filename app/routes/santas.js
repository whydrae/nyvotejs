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
        User.find(function(err, users) {
          if (err) {
            return res.status(500).json({
              err: err
            });
          }
          if (users) {
            Santa.create({
              from: req.user._id,
              to: users[1]._id
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
          }
        });
      }
    });
  }
});

module.exports = router;
