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
        text: req.body.verseText
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

  if (req.user._id) {
    Verse.findOne({
        for: req.user._id
      })
      .then((verse) => {
        if (verse) {
          return res.status(200).json({
            verse: verse
          })
        } else {
          Verse.count()
            .then((count) => {
              const random = Math.floor(Math.random() * count)
              return Verse.findOne().skip(random)
            })
            .then((verse) => {
              verse.for = req.user._id;
              return verse.save()
            })
            .then((updatedVerse) => res.status(200).json({
              verse: updatedVerse
            }))
            .catch((err) => res.status(500).json({
              err: err
            }))
        }
      })
      .catch((err) => res.status(500).json({
        err: err
      }))
  }
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
