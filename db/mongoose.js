var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.Promise = Promise;
mongoose.connect(config.get('mongoose:uri'), {
  useMongoClient: true,
  promiseLibrary: global.Promise
});

var db = mongoose.connection;

db.on('error', (err) => {
  console.error('Connection error: ' + err.message);
});

db.once('open', function callback() {
  console.info("Connected to DB!");
});

module.exports = mongoose;
