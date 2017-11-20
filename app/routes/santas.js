var express = require('express');
var router = express.Router();

var Santa = require('../models/santa');
var User = require('../models/user');
var Wish = require('../models/wish');

router.get('/recipient', function (req, res) {
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
        User.findOne({
            _id: santa.to
          },
          function (err, user) {
            if (err) {
              return res.status(500).json({
                err: err
              });
            }
            return res.status(200).json({
              recipient: user
            });
          });
      } else {
        return res.status(200).json({
          err: "You're not a santa!"
        });
      }
    });
  } else {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }
});

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
        getRandomUserForSanta(req.user, function (err, user) {
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

router.post('/reset', function (req, res) {
  if (req.isAuthenticated()) {
    Santa.remove({}, function (err) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      Wish.remove({}, function (err) {
        if (err) {
          return res.status(500).json({
            err: err
          });
        }
        return res.status(200).json({
          status: "Success!"
        });
      });
    });

  } else {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }
})

function getRandomUserForSanta(santa, callback) {
  Santa.find({
    from: {
      $ne: santa._id
    },
  }, function (err, santas) {
    // searching for users than already have santa
    var haveSanta = [];
    if (santas) {
      haveSanta = santas.map(function (santaFound) {
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
      function (err, users) {
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
              if (user.couple.equals(santa._id)) {
                continue;
              } else {
                found = true;
                break;
              }
            } while (found === false && i < 500);
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