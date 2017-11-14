var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var config = require('./config');
var LocalStrategy = require('passport-local').Strategy;

var port = process.env.PORT || config.get('port');

var db = require('./db/mongoose');

var users = require('./app/routes/users');
var santas = require('./app/routes/santas');

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

app.use(express.static(__dirname + 'public'));

var User = require('./app/models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/user/', users);
app.use('/santa/', santas);

app.listen(port, () => {
  console.log('Well, we are here.');
});
