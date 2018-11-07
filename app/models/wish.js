var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Wish = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'users' },
  wish: { type: String }
});

module.exports = mongoose.model('wishes', Wish);
