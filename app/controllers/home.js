var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Guid = require('guid'),
  config = require('../../config/config'),
  Request = require('request'),
  Querystring = require('querystring'),
  passport = require('passport');


router.get('/profile', function (req, res) {
    console.log('req.user', req.user);
    res.render('profile', {
      title : 'Profile',
      user : req.user.toClientJSON(),
      googleMapsKey : config.googleMapsKey
    });
});

router.get('/', function (req, res) {
  var locals = {
    title : 'Home',
    user : req.user.toClientJSON(),
    googleMapsKey : config.googleMapsKey
  };
  res.render('index', locals);
});

module.exports = function (app) {
  app.use('/', router);
};