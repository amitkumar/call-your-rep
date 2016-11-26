// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var timestamps = require('mongoose-timestamp');

var UserSchema = new Schema({
  email : {
  	type : String,
  	index : true
  },
  phone: {
  	type : String,
  	index : true
  },
  verified : Boolean,
  zipCode : String,

});

UserSchema.plugin(timestamps);

mongoose.model('User', UserSchema);

