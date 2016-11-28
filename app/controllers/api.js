const express = require('express'),
	router = express.Router(),
	url = require('url'),
	mongoose = require('mongoose'),
	restify = require('express-restify-mongoose'),
	requireLoggedIn = require('../lib/route-utils').requireLoggedIn,
	findYourRepresentative = require('../lib/find-your-representative');

	
/** 
 * req.params.address : address object, formatted as used in User model
 */
router.get('/get-congressperson', requireLoggedIn, function (req, res) {
	// console.log('/get-congressperson query', req.query);
	
	findYourRepresentative(req.query.address, function(err, representative){
		res.send(representative);
	});
});


module.exports = router;

