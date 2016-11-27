var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Guid = require('guid'),
  config = require('../../config/config'),
  Request = require('request'),
  Querystring = require('querystring'),
  passport = require('passport'),
  requireLoggedIn = require('../lib/route-utils').requireLoggedIn;


router.get('/profile', requireLoggedIn, function (req, res) {
    console.log('req.user', req.user);
    res.render('profile', {
      title : 'Profile',
      user : req.user.toClientJSON(),
      googleMapsKey : config.googleMapsKey
    });
});

router.post('/profile', requireLoggedIn, function (req, res) {
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
    user : req.user ? req.user.toClientJSON() : '{}',
    googleMapsKey : config.googleMapsKey
  };
  res.render('index', locals);
});

module.exports = router;