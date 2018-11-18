const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Santa = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'users' },
  to: { type: Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('santas', Santa);
