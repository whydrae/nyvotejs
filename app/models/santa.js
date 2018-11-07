var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Santa = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'users' },
  to: { type: Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('santas', Santa);
