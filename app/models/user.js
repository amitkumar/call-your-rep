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
  address : {
  	street : String,
  	city : String,
  	state : String,
  	zip : String,
  	country : String
  },
  googleAddress : Object,
  facebook : Object,
  isAdmin : { type : Boolean, access : 'protected' }
});

UserSchema.virtual('address.friendlyDisplay').get(function(){
	return this.address.street + ', ' + this.address.city + ', ' + this.address.state + ' ' + this.address.zip;
});

UserSchema.plugin(timestamps);

UserSchema.method('toClientJSON', function(stringify) {
  const result = {
  	_id : this._id,
  	name : this.name,
  	phone : this.phone,
  	address : this.address,
  	facebook : this.facebook
  };
  if (stringify){
  	return JSON.stringify(result);
  } else {
  	return result;
  }
});

module.exports = mongoose.model('User', UserSchema);

