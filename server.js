var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var config = require('./config');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');

var port = process.env.PORT || config.get('port');

var db = require('./db/mongoose');

var users = require('./app/routes/users');
var santas = require('./app/routes/santas');
var wishes = require('./app/routes/wishes');

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

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

app.listen(port, () => {
  console.log('Secret Santa API is running on ' + port);
});
