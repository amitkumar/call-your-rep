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
  name : String,
  verified : Boolean,
  zipCode : String,
  facebook : Object
});

UserSchema.plugin(timestamps);

UserSchema.method('toClientJSON', function() {
  return {
  	_id : this._id,
  	name : this.name
  };
});

module.exports = mongoose.model('User', UserSchema);

