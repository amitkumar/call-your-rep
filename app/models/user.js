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
  facebook : Object,
  isAdmin : { type : Boolean, access : 'protected' }
});

UserSchema.plugin(timestamps);

UserSchema.method('toClientJSON', function(stringify) {
  const result = {
  	_id : this._id,
  	name : this.name,
  	phone : this.phone,
  	facebook : this.facebook
  };
  if (stringify){
  	return JSON.stringify(result);
  } else {
  	return result;
  }
});

module.exports = mongoose.model('User', UserSchema);

