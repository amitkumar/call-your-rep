const express = require('express'),
glob = require('glob'),
mongoose = require('mongoose'),
User = require('../app/models/user'),
Guid = require('guid');


const passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy;
// , AccountKitStrategy = require('./app/lib/passport-accountkit-strategy');

module.exports = function(app, config) {
  

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: config.facebook.appId,
    clientSecret: config.facebook.appSecret,
    callbackURL: config.url + "auth/facebook/callback",
    enableProof: true
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('facebook returned profile', profile);
    User.findOne({
      'facebook.id': profile.id
    },
    function(err, user) {
      if (err) {
        return done(err);
      } else if (user) {
        return done(null, user);
      } else {
        var newUser = new User();
        newUser.facebook = profile;
        // newUser.email = profile.emails[0].value;
        newUser.name = profile.displayName;
        newUser.save(function(err) {
          if (err) {
            return done(err);
          }
          // if successful, return the new user
          return done(null, newUser);
        });
      }
    });
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: 'email'
    })
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login',
      successRedirect: '/profile',
    })
  );
};