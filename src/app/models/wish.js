const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Wish = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'users' },
  wish: { type: String }
});

module.exports = mongoose.model('wishes', Wish);
