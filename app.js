

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  User = require('./app/models/user');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

// var passport = require('passport')
//   , FacebookStrategy = require('passport-facebook').Strategy;

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });


// app.use(passport.initialize());
// app.use(passport.session());
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


// app.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// app.get('/login', function(req, res, next) {
//   res.send('Go back and register!');
// });

// app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'user:email' ] }));

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication
//     res.json(req.user);
//   });


module.exports = require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

