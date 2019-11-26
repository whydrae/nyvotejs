const mongoose = require('mongoose');
const config = require('../config.js');

mongoose.connect(config.get('mongoose:uri'), {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Connection error: ' + err.message);
});

db.once('open', () => {
  console.info("Connected to DB!");
});

module.exports = mongoose;
