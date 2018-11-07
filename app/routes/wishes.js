var express = require('express');
var router = express.Router();

var Santa = require('../models/santa');
var Wish = require('../models/wish');

router.get('/my', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Wish.find({
    from: req.user._id
  }, function (err, wish) {
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

router.get('/for', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Santa.findOne({
    from: req.user._id,
  },
    function (err, santa) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      if (santa) {
        Wish.find({
          from: santa.to
        }, function (err, wish) {
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
});

router.post('/', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Wish.create({
    from: req.user._id,
    wish: req.body.wish
  }, function (err, wish) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    Wish.find({
      from: req.user._id
    }, function (err, wish) {
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
});

router.delete('/:wish_id', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Wish.remove({
    _id: req.params.wish_id
  }, function (err, wish) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    Wish.find({
      from: req.user._id
    }, function (err, wish) {
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
});

module.exports = router;
