const express = require('express');
const router = express.Router();
const isAuthenticated = require("./authenticate");

const Santa = require('../models/santa');
const Wish = require('../models/wish');

router.get('/my', isAuthenticated, function (req, res) {
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

router.get('/for', isAuthenticated, function (req, res) {
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

router.post('/', isAuthenticated, function (req, res) {
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

router.put('/:wish_id', isAuthenticated, function (req, res) {
  Wish.findByIdAndUpdate({
    _id: req.params.wish_id
  }, { $set: { wish: req.body.wish } })
    .then((wish) => {
      if (wish) {
        return Wish.find({
          from: req.user._id
        })
          .then((wish) => res.status(200).json({
            wishes: wish
          }))
      } else {
        return res.status(200).json({
          wishes: []
        });
      }
    })
    .catch((err) => res.status(500).json({
      err: err
    }));
});

router.delete('/:wish_id', isAuthenticated, function (req, res) {
  Wish.deleteOne({
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
