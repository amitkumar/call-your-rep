

module.exports = function (app) {
  const express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  restify = require('express-restify-mongoose');

var userUri = restify.serve(app, require('../models/user'), {
	private: ['isAdmin'],
	preMiddleware: function (req, res, next) {
	  console.log('preMiddleware', req.user, req.params);
	  if ( (!req.user.isAdmin) && (req.user._id.toString() !== req.params.id)){
		  	console.log('req user is not admin and doesnt match requested user', req.user._id.toString(), req.params.id);
	  		return next(new Error('Unauthorized'));
	  } else {
	  	return next();
	  }
	}
});

console.log('user URI', userUri);

};