var path = require('path'),
    env = process.env.NODE_ENV || 'development',
    dotenv = require('dotenv');

var config = {
  development: {
    port: process.env.PORT || 3000,
    url : process.env.CYR_DEV_BASE_URL,
    db: process.env.CYR_DEV_DB,
    facebook : {
      appId      : process.env.CYR_FB_TEST_APP_ID,
      xfbml      : true,
      version    : process.env.CYR_FB_TEST_APP_SECRET,
      appSecret : process.env.CYR_FB_TEST_APP_SECRET,
      appToken : process.env.CYR_FB_TEST_APP_TOKEN,
      accountKitVersion : process.env.CYR_FB_TEST_ACCOUNTKIT_VERSION
    },
    googleMapsKey : process.env.CYR_GOOGLE_MAPS_KEY,
    twilio : {
      accountSid : process.env.CYR_TWILIO_ACCOUNT_SID,
      authToken : process.env.CYR_TWILIO_AUTH_TOKEN,
      phoneNumber : process.env.CYR_TWILIO_PHONE_NUMBER
    }
  },


  production: {
    port: process.env.PORT || 3000,
    url : process.env.CYR_BASE_URL,
    db: process.env.CYR_DB,
    facebook : {
      appId      : process.env.CYR_FB_APP_ID,
      xfbml      : true,
      version    : process.env.CYR_FB_APP_SECRET,
      appSecret : process.env.CYR_FB_APP_SECRET,
      appToken : process.env.CYR_FB_APP_TOKEN,
      accountKitVersion : process.env.CYR_FB_ACCOUNTKIT_VERSION
    },
    googleMapsKey : process.env.CYR_GOOGLE_MAPS_KEY,
    twilio : {
      accountSid : process.env.CYR_TWILIO_ACCOUNT_SID,
      authToken : process.env.CYR_TWILIO_AUTH_TOKEN,
      phoneNumber : process.env.CYR_TWILIO_PHONE_NUMBER
    }
  }
};


module.exports = config[env];
