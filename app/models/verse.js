const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Verse = new Schema({
  for: { type: Schema.Types.ObjectId, ref: "users" },
  text: { type: String }
});

module.exports = mongoose.model("verses", Verse);
