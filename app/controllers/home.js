var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Guid = require('guid'),
  config = require('../../config/config'),
  Request = require('request'),
  Querystring = require('querystring');

var csrf_guid = Guid.raw();
const api_version = config.facebook.accountKitVersion;
const app_id = config.facebook.appId;
const app_secret = config.facebook.appSecret;
const me_endpoint_base_url = 'https://graph.accountkit.com/' + config.facebook.accountKitVersion + '/me';
const token_exchange_base_url = 'https://graph.accountkit.com/' + config.facebook.accountKitVersion + '/access_token'; 

router.get('/login-successful', function (req, res, next) {
    console.log('req.user', req.user);
    res.render('login-successful', {
      title : 'Login Successful',
      user : req.user
    });
});


router.get('/', function (req, res, next) {
  var locals = {
    appId: app_id,
    csrf: csrf_guid,
    version: api_version,
    user : req.user
  };
  res.render('index', locals);

  // User.find(function (err, users) {
  //   if (err) return next(err);
  //   res.render('index', {
  //     title: 'Generator-Express MVC',
  //     users: users
  //   });
  // });
});

router.post('/auth/accountkit/callback', function(request, response){
  console.log('request.body', request.body);

  console.log('code: ' + request.body.code);

  // CSRF check
  if (request.body.csrf_nonce === csrf_guid) {
    var app_access_token = ['AA', app_id, app_secret].join('|');
    var params = {
      grant_type: 'authorization_code',
      code: request.body.code,
      access_token: app_access_token
    };
  
    // exchange tokens
    var token_exchange_url = token_exchange_base_url + '?' + Querystring.stringify(params);
    Request.get({url: token_exchange_url, json: true}, function(err, resp, respBody) {
      var locals = {
        user_access_token: respBody.access_token,
        expires_at: respBody.expires_at,
        user_id: respBody.id, 
      };

      // get account details at /me endpoint
      var me_endpoint_url = me_endpoint_base_url + '?access_token=' + respBody.access_token;
      Request.get({url: me_endpoint_url, json:true }, function(err, resp, respBody) {
        console.log('accountkit respBody', respBody);
        // send login_success.html
        if (respBody.phone) {
          locals.phone = respBody.phone.number;
        }
        //  else if (respBody.email) {
        //   locals.email = respBody.email.address;
        // }
        // var html = Mustache.to_html(loadLoginSuccess(), view);
        // response.send(html);

        User.findOneAndUpdate(
          { phone : locals.phone }, 
          { accountKitProfile :  respBody }, 
          { 
            new : true,
            setDefaultsOnInsert : true,
            upsert : true 
          }, 
          function(err, user) {
            request.logIn(user,function(err) {
              console.log('logged in user', user);
              if (err) { return next(err); }
              // return res.redirect('/users/' + req.user.username);
              response.redirect('/login-successful');
            });
        });
      });
    });
  } 
  else {
    // login failed
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end("Something went wrong. :( ");
  }
});

module.exports = function (app) {
  app.use('/', router);
};