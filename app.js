

const express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  User = require('./app/models/user'),
  Guid = require('guid');

mongoose.connect(config.db);
const db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

const models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
const app = express();

const passport = require('passport')
  // , FacebookStrategy = require('passport-facebook').Strategy
  , AccountKitStrategy = require('./app/lib/passport-accountkit-strategy');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.use(passport.initialize());
app.use(passport.session());

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.phone);
});

// used to deserialize the user
passport.deserializeUser(function(phone, done) {
    User.findOne({ phone : phone}, function(err, user) {
        done(err, user);
    });
});



// const csrf_guid = Guid.raw();
// const api_version = config.facebook.accountKitVersion;
// const app_id = config.facebook.appId;
// const app_secret = config.facebook.appSecret;
// const me_endpoint_base_url = 'https://graph.accountkit.com/' + config.facebook.accountKitVersion + '/me';
// const token_exchange_base_url = 'https://graph.accountkit.com/' + config.facebook.accountKitVersion + '/access_token'; 

// passport.use(new AccountKitStrategy({
// 	appId: app_id,
//     csrf: csrf_guid,
//     version: api_version,
//     appSecret: app_secret
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));
// app.get('/auth/accountkit',
//   passport.authenticate('accountkit'));

// app.get('/auth/accountkit/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

// passport.use(new FacebookStrategy({
//     clientID: config.facebook.appId,
//     clientSecret: config.facebook.appSecret,
//     callbackURL: 'http://www.callyourlawmaker.org/auth/facebook/callbackRemove'
//   },
//   function(accessToken, refreshToken, profile, done) {
//     var searchQuery = {
//       email: profile.emails[0]
//     };	

//     var updates = {
//       name: profile.displayName
//     };

//     var options = {
//       upsert: true
//     };

//     User.findOrCreate(profile, function(err, user) {
//       if (err) { return done(err); }
//       done(null, user);
//     });
//   }
// ));
// // Redirect the user to Facebook for authentication.  When complete,
// // Facebook will redirect the user back to the application at
// //     /auth/facebook/callback
// app.get('/auth/facebook', passport.authenticate('facebook'));

// // Facebook will redirect the user to this URL after approval.  Finish the
// // authentication process by attempting to obtain an access token.  If
// // access was granted, the user will be logged in.  Otherwise,
// // authentication has failed.
// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { successRedirect: '/',
//                                       failureRedirect: '/login' }));



module.exports = require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

