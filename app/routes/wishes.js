var express = require('express');
var router = express.Router();

var Santa = require('../models/santa');
var Wish = require('../models/wish');

router.get('/my', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Wish.find({
      from: req.user._id
    })
    .then((wish) => res.status(200).json({
      wishes: wish
    }))
    .catch((err) => res.status(500).json({
      err: err
    }))
});

router.get('/for', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Santa.findOne({
      from: req.user._id,
    })
    .then((santa) => {
      if (santa) {
        Wish.find({
            from: santa.to
          })
          .then((wish) => res.status(200).json({
            wishes: wish
          }))
          .catch((err) => res.status(500).json({
            err: err
          }))
      } else {
        return res.status(200).json({
          wishes: []
        })
      }
    })
    .catch((err) => res.status(500).json({
      err: err
    }))
});

router.post('/', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Wish.create({
      from: req.user._id,
      wish: req.body.wish
    })
    .then(() => Wish.find({
      from: req.user._id
    }))
    .then((wish) => res.status(200).json({
      wishes: wish
    }))
    .catch((err) => res.status(500).json({
      err: err
    }))
});

router.delete('/:wish_id', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Wish.remove({
      _id: req.params.wish_id
    })
    .then(() => Wish.find({
      from: req.user._id
    }))
    .then((wish) => res.status(200).json({
      wishes: wish
    }))
    .catch((err) => res.status(500).json({
      err: err
    }))
});

module.exports = router;
