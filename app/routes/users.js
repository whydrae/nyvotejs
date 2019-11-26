const express = require("express");
const router = express.Router();
const passport = require("passport");
const isAuthenticated = require("./authenticate");
const mongoose = require("mongoose");
const config = require("../../config.js");
const ObjectId = mongoose.mongo.ObjectId;
const User = require("../models/user");

router.post("/register", function(req, res) {
  const secret = config.get("session:secret");
  if (req.body.secret && req.body.secret === secret) {
    User.register(
      new User({
        username: req.body.username,
        couple: new ObjectId(),
        name: req.body.name,
        forname: req.body.forname
      }),
      req.body.password,
      function(err) {
        if (err) {
          return res.status(500).json({
            err: err
          });
        }

        passport.authenticate("local")(req, res, function() {
          return res.status(200).json({
            status: "Registration successful!"
          });
        });
      }
    );
  } else {
    return res.status(401).json({
      status: "Not authorized"
    });
  }
});

router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
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
          err: "Could not get user"
        });
      }
      res.status(200).json({
        status: "Login successful!"
      });
    });
  })(req, res, next);
});

router.get("/logout", function(req, res) {
  req.logout();
  res.status(200).json({
    status: "Bye!"
  });
});

router.get("/status", function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

router.get("/currentUser", isAuthenticated, function(req, res) {
  res.status(200).json({
    user: req.user
  });
});

router.post("/setCouple", isAuthenticated, function(req, res) {
  // User 1
  User.findOne(
    {
      username: req.body.user1
    },
    function(err, userFound1) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      // User 2
      User.findOne(
        {
          username: req.body.user2
        },
        function(err, userFound2) {
          if (err) {
            return res.status(500).json({
              err: err
            });
          }
          // Set couples
          User.findByIdAndUpdate(
            {
              _id: userFound1._id
            },
            {
              $set: {
                couple: userFound2._id
              }
            },
            {
              new: true
            },
            function(err, user) {
              if (err) {
                return res.status(500).json({
                  err: err
                });
              }
              if (user) {
                User.findByIdAndUpdate(
                  {
                    _id: userFound2._id
                  },
                  {
                    $set: {
                      couple: userFound1._id
                    }
                  },
                  {
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
                  }
                );
              }
            }
          );
        }
      );
    }
  );
});

module.exports = router;
