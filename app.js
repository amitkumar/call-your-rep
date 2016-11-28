

const express = require('express'),
  dotenv = require('dotenv').config(),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  User = require('./app/models/user'),
  Guid = require('guid');

mongoose.connect(config.db);
const db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

const models = glob.sync('./app/models/*.js');
models.forEach(function (model) {
  require(model);
});
const app = express();

require('./config/express')(app, config);

require('./config/twilio').test();

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

module.exports = app;