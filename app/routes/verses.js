const express = require('express');
const router = express.Router();
const isAuthenticated = require("./authenticate");

const Verse = require('../models/verse');

router.post('/', isAuthenticated, (req, res) => {
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

router.post('/set', isAuthenticated, (req, res) => {
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
      if (verses.length > 0) {
        const random = Math.floor(Math.random() * verses.length)
        const verse = verses[random];
        verse.for = req.user._id;
        return verse.save()
      } else {
        return new Promise((resolve, reject) => {
          reject("No verse left!");
        })
      }
    })
    .then((updatedVerse) => res.status(200).json({
      verse: updatedVerse
    }))
    .catch((err) => res.status(500).json({
      err: err
    }))
})

router.get('/my', isAuthenticated, (req, res) => {
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
