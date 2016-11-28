var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var facebook = {
  // Call Your Lawmakers test app : https://developers.facebook.com/apps/208473356265838/account-kit/
  'call-your-lawmakers-test1' : {
    appId      : '208473356265838',
    xfbml      : true,
    version    : 'v2.6',
    appSecret : 'a56d46e5cf5c1721c8efb98522454463',
    appToken : '2189434359d46518b30c4d1a1b53ec49',
    accountKitVersion : 'v1.1'
  }
};

var twilio = {
  accountSid : 'AC225c052dd5707e5a8458137b2630b9b2',
  authToken : "d847ddc0c2d54617c00bf304a0043f91",
  phoneNumber : '+14243292581 '
}


var config = {
  development: {
    root: rootPath,
    app: {
      name: 'call-your-congressperson'
    },
    port: process.env.PORT || 3000,
    url : 'http://localhost:3000',
    db: 'mongodb://admin:jDKW!WPm6R$2@ds163377.mlab.com:63377/call-your-lawmakers',
    facebook : facebook['call-your-lawmakers-test1'],
    googleMapsKey : 'AIzaSyCFzuCB3XMJbKxJmc_7_m6M49rwHbl2r8s',
    twilio : twilio
  },

  test: {
    root: rootPath,
    app: {
      name: 'call-your-congressperson'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/call-your-congressperson-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'call-your-congressperson'
    },
    port: process.env.PORT || 3000,
    url : 'https://callyourlawmakers.herokuapp.com/',
    db: 'mongodb://admin:jDKW!WPm6R$2@ds163377.mlab.com:63377/call-your-lawmakers',
    googleMapsKey : 'AIzaSyCFzuCB3XMJbKxJmc_7_m6M49rwHbl2r8s',
    facebook : {
      appId      : '207540456359128',
      xfbml      : true,
      version    : 'v2.6',
      appSecret  : '55e15e4adcc2d34ac4aba0648cc6a247',
      accountKitVersion : 'v1.1'
    },
    twilio : twilio
  }
};


module.exports = config[env];
