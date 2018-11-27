const express = require('express');
const router = express.Router();

const Santa = require('../models/santa');
const User = require('../models/user');
const Wish = require('../models/wish');

router.get('/recipient', function(req, res) {
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

router.post('/recipient', function(req, res) {
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
        getRandomUserForSanta(req.user, function(err, user) {
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
                } else {
                  return res.status(500).json({
                    err: {
                      err: "User was not found"
                    }
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

router.post('/reset', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Santa.deleteMany({})
    .then(() => Wish.deleteMany({}))
    .then(() => res.status(200).json({
      status: "Success!"
    }))
    .catch((err) => res.status(500).json({
      err: err
    }))
});

router.post('/check', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  var resolveLen = 0;
  var santasLen = 0;

  var oWait = new Promise((resolve, reject) => {
    let found = false;
    Santa.find({}, function(err, santas) {
      santasLen = santas.length;
      for (var i = 0; i < santas.length; i++) {
        var santa = santas[i];
        User.findOne({
          $and: [{
              _id: {
                $eq: santa.from
              }
            },
            {
              couple: {
                $eq: santa.to
              }
            }
          ]
        }, function(err, user) {
          resolveLen = resolveLen + 1;
          if (user) {
            found = true;
          }
          if (resolveLen === santasLen) {
            resolve(found);
          }
        });
      }
    });
  })

  oWait.then((found) => {
    if (found) {
      return res.status(500).json({
        status: "Couple found!"
      });
    } else {
      return res.status(200).json({
        status: "Success! Count: " + santasLen
      });
    }
  })
});

function getRandomUserForSanta(santa, callback) {
  Santa.find({})
    .then((santas) => {
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
        })
        .then(((users) => {
          if (users) {
            var user = null;

            // there's only one user left
            if (users.length === 1) {
              callback(null, users[0]);
              return;
            }

            // last user has no santa, nor recipient
            if (users.length === 2) {
              // console.log("Last two: ")
              for (var i = 0; i < users.length; i++) {
                var userLast = users[i];
                let found = false;

                for (var j = 0; j < santas.length; j++) {
                  // check whether last user is santa
                  if (santas[j].from.equals(userLast._id)) {
                    // console.log("Is santa: " + userLast.username)
                    found = true;
                  }
                }

                if (!found) {
                  user = userLast;
                }
              }
              if (user) {
                callback(null, user);
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
            } while (stopNumber < 500);

            callback(null, user);
          }
        }))
        .catch((err) => callback(err))
    })
    .catch((err) => callback(err))
}

module.exports = router;
