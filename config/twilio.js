var config = require('./config');
// Download the Node helper library from twilio.com/docs/node/install
// These vars are your accountSid and authToken from twilio.com/user/account
var accountSid = config.twilio.accountSid;
var authToken = config.twilio.authToken;
var client = require('twilio')(accountSid, authToken);


module.exports = {
	test : function(){
		client.messages.create({
		    body: 'Hello from Node',
		    to: '+13104908091',  // Text this number
		    from: config.twilio.phoneNumber // From a valid Twilio number
		}, function(err, message) {
		    console.log('twilio test', err, message);
		});		
	}
};


// client.calls.create({
//     url: "http://demo.twilio.com/docs/voice.xml",
//     to: "+14155551212",
//     from: "+15017250604"
// }, function(err, call) {
//     process.stdout.write(call.sid);
// });