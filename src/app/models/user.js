const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    username: String,
    password: String,
    couple: { type: Schema.Types.ObjectId, ref: 'users' },
    name: String,
    forname: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);
