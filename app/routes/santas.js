const express = require('express');
const router = express.Router();

const Santa = require('../models/santa');
const User = require('../models/user');
const Wish = require('../models/wish');

router.get('/recipient', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Santa.findOne({
      from: req.user.id
    })
    .then((santa) => {
      if (santa) {
        User.findOne({
            _id: santa.to
          })
          .then((user) => {
            res.status(200).json({
              recipient: user
            })
          })
          .catch((err) => res.status(500).json({
            err: err
          }))
      } else {
        return res.status(200).json({
          err: "You're not a santa!"
        })
      }
    })
    .catch((err) => res.status(500).json({
      err: err
    }))
});

router.post('/recipient', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Santa.findOne({
      from: req.user._id
    })
    .then((santa) => {
      if (santa) {
        return res.status(200).json({
          recipient: santa
        });
      } else {
        getRandomUserForSanta(req.user, function (err, user) {
          if (err) {
            return res.status(500).json({
              err: err
            });
          }
          if (user) {
            Santa.create({
                from: req.user._id,
                to: user._id
              })
              .then((recipient) => {
                if (recipient) {
                  return res.status(200).json({
                    recipient: recipient
                  });
                }
              })
              .catch((err) => res.status(500).json({
                err: err
              }))
          } else {
            return res.status(500).json({
              err: {
                err: "User was not found"
              }
            });
          }
        });
      }
    })
    .catch((err) => res.status(500).json({
      err: err
    }))
});

router.post('/reset', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Santa.remove({})
    .then(() => Wish.remove({}))
    .then(() => res.status(200).json({
      status: "Success!"
    }))
    .catch((err) => res.status(500).json({
      err: err
    }))
});

router.post('/check', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Santa.find({}, function (err, santas) {
    for (var i = 0; i < santas.length; i++) {
      var santa = santas[i];
      User.findById({
        _id: santa.from
      }, function (err, user) {
        if (user.couple.equals(santa.to)) {
          return res.status(500).json({
            status: "Couple found!"
          });
        }
      });
    }
    return res.status(200).json({
      status: "Success! Count: " + santas.length
    });
  });
});

function getRandomUserForSanta(santa, callback) {
  Santa.find({}, function (err, santas) {
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
          var user = null;

          // there's only one user left
          if (users.length === 1) {
            callback(null, user);
            return;
          }

          // last user has no santa, nor recipient
          if (users.length === 2) {
            let found = false;

            for (var i = 0; i < users.length; i++) {
              var lastUser = users[i];

              for (var j = 0; j < santas.length; j++) {
                if (santas[j].from.equals(lastUser._id)) {
                  found = true;
                }
              }
            }

            if (!found) {
              callback(null, lastUser);
              return;
            }
          }

          // get random
          let stopNumber = 0;
          do {
            stopNumber = stopNumber + 1;
            user = users[Math.floor(Math.random() * users.length)];
            if (user.couple.equals(santa._id)) {
              continue;
            }
            break;
          } while (stopNumber > 500);

          callback(null, user);
        }
      });
  });
}

module.exports = router;