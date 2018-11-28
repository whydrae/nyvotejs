const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const config = require('./config');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

const port = process.env.PORT || config.get('port');

const db = require('./db/mongoose'); // eslint-disable-line no-unused-vars

const users = require('./app/routes/users');
const santas = require('./app/routes/santas');
const wishes = require('./app/routes/wishes');
const verses = require('./app/routes/verses');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// passport
app.use(session({
  secret: config.get('session:secret'),
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

var User = require('./app/models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/user/', users);
app.use('/santa/', santas);
app.use('/wish/', wishes);
app.use('/verse/', verses);

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

app.listen(port, () => {
  console.log('Secret Santa API is running on ' + port);
});