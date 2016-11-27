// Load modules.
const Guid = require('guid')
  , util = require('util')
  , uri = require('url')
  , crypto = require('crypto')
  , Querystring  = require('querystring')
  , Request = require('request')
  ;

/**
 * `Strategy` constructor.
 *
 * Options:
 *   - `clientID`      your Facebook application's App ID
 *   - `appSecret`  your Facebook application's App Secret
 *
 * @constructor
 * @param {object} options
 
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};
  this._apiVersion = options.version;
  this._appId = options.appId;
  this._appSecret = options.appSecret;
  this._csrf = options.csrf;
  this._me_endpoint_base_url = options.profileURL = 'https://graph.accountkit.com/' + config.version + '/me';
  this._token_exchange_base_url = options.tokenURL = 'https://graph.accountkit.com/' + options.version + '/access_token'; 
  this.name = 'accountkit';
}


/**
 * Authenticate request by delegating to AccountKit
 *
 * @param {http.IncomingMessage} req
 * @param {object} options
 * @access protected
 */
Strategy.prototype.authenticate = function(req, options) {
  console.log('Strategy.prototype.authenticate, req.body', req.body);

  console.log('code: ' + req.body.code);

  // CSRF check
  if (request.body.csrf_nonce === csrf_guid) {
    const app_access_token = ['AA', this._appId, this._appSecret].join('|');
    const params = {
      grant_type: 'authorization_code',
      code: req.body.code,
      access_token: app_access_token
    };
  
    // exchange tokens
    const token_exchange_url = this._token_exchange_base_url + '?' + Querystring.stringify(params);
    Request.get({url: token_exchange_url, json: true}, function(err, resp, respBody) {
      var locals = {
        user_access_token: respBody.access_token,
        expires_at: respBody.expires_at,
        user_id: respBody.id, 
      };

      // get account details at /me endpoint
      const me_endpoint_url = me_endpoint_base_url + '?access_token=' + respBody.access_token;
      Request.get({url: me_endpoint_url, json:true }, function(err, resp, respBody) {
        console.log('accountkit respBody', respBody);
        // send login_success.html
        if (respBody.phone) {
          locals.phone = respBody.phone;
        } else if (respBody.email) {
          locals.email = respBody.email;
        }
        response.render('login-successful', locals);
      });
    });
  } 
  else {
    // login failed
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end("Something went wrong. :( ");
  }
};



// Expose constructor.
module.exports = Strategy;
