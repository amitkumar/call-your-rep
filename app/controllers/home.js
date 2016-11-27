

module.exports = function (app) {
  var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Guid = require('guid'),
  config = require('../../config/config'),
  Request = require('request'),
  Querystring = require('querystring'),
  passport = require('passport');

// route middleware to make sure a user is logged in
function requireLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) 
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

app.get('/profile', requireLoggedIn, function (req, res) {
    console.log('req.user', req.user);
    res.render('profile', {
      title : 'Profile',
      user : req.user.toClientJSON(),
      googleMapsKey : config.googleMapsKey
    });
});



app.post('/profile', requireLoggedIn, function (req, res) {
    console.log('req.user', req.user);
    res.render('profile', {
      title : 'Profile',
      user : req.user.toClientJSON(),
      googleMapsKey : config.googleMapsKey
    });
});

app.get('/', function (req, res) {
  var locals = {
    title : 'Home',
    user : req.user ? req.user.toClientJSON() : '{}',
    googleMapsKey : config.googleMapsKey
  };
  res.render('index', locals);
});
};