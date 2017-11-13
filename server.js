var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var config = require('./config');

var db = require('./db/mongoose');

var port = process.env.PORT || config.get('port');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

// passport
app.use(session({
  secret: config.get('session:secret')
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + 'public'));

app.listen(port, () => {
  console.log('Well, we are here.');
});
