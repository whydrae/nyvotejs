var express = require('express');
var router = express.Router();

var Santa = require('../models/santa');
var Wish = require('../models/wish');

router.get('/my', function(req, res) {
  if (req.isAuthenticated()) {
    Wish.find({
      from: req.user._id
    }, function(err, wish) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      return res.status(200).json({
        wishes: wish
      });
    });
  } else {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }
});

router.get('/for', function(req, res) {
  if (req.isAuthenticated()) {
    Santa.findOne({
        from: req.user._id,
      },
      function(err, santa) {
        if (err) {
          return res.status(500).json({
            err: err
          });
        }
        if (santa) {
          Wish.find({
            from: santa.to
          }, function(err, wish) {
            if (err) {
              return res.status(500).json({
                err: err
              });
            }
            return res.status(200).json({
              wishes: wish
            });
          });
        } else {
          return res.status(200).json({
            wishes: []
          });
        }
      });
  } else {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }
});

router.post('/', function(req, res) {
  if (req.isAuthenticated()) {
    Wish.create({
      from: req.user._id,
      wish: req.body.wish
    }, function(err, wish) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      Wish.find({
        from: req.user._id
      }, function(err, wish) {
        if (err) {
          return res.status(500).json({
            err: err
          });
        }
        return res.status(200).json({
          wishes: wish
        });
      });
    });
  } else {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }
});

router.delete('/:wish_id', function(req, res) {
  if (req.isAuthenticated()) {
    Wish.remove({
      _id: req.params.wish_id
    }, function(err, wish) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      Wish.find({
        from: req.user._id
      }, function(err, wish) {
        if (err) {
          return res.status(500).json({
            err: err
          });
        }
        return res.status(200).json({
          wishes: wish
        });
      });
    });
  } else {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }
});

module.exports = router;
