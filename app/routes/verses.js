const express = require('express');
const router = express.Router();

const Verse = require('../models/verse');

router.post('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  if (req.body.verseText) {
    Verse.create({
        text: req.body.verseText,
        for: null
      })
      .then((verse) => res.status(200).json({
        verse: verse
      }))
      .catch((err) => res.status(500).json({
        err: err
      }))
  }
})

router.post('/set', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  // unassign verse
  Verse.findOne({
      for: req.user._id
    })
    .then((verse) => {
      if (verse) {
        verse.for = null;
        verse.save()
      }
    })
    .catch((err) => res.status(500).json({
      err: err
    }))

  // assign new one
  Verse.find({
      for: null
    })
    .then((verses) => {
      const random = Math.floor(Math.random() * verses.length)
      const verse = verses[random];
      verse.for = req.user._id;
      return verse.save()
    })
    .then((updatedVerse) => res.status(200).json({
      verse: updatedVerse
    }))
    .catch((err) => res.status(500).json({
      err: err
    }))
})

router.get('/my', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      err: "Unauthorized"
    });
  }

  Verse.findOne({
      for: req.user._id
    })
    .then((verse) => res.status(200).json({
      verse: verse
    }))
    .catch((err) => res.status(500).json({
      err: err
    }))
})

module.exports = router;
