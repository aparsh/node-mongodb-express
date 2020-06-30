var pssport = require('passport');
var LocalStratergy = require('passport-local').Strategy;
var User = require('./models/user');
const passport = require('passport');

exports.local = passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());