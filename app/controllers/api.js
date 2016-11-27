const express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	restify = require('express-restify-mongoose'),
	requireLoggedIn = require('../lib/route-utils').requireLoggedIn;

	

router.get('/get-congressperson', requireLoggedIn, function (req, res) {
});


module.exports = router;

