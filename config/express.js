const express = require('express');
const glob = require('glob');

const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');

const restify = require('express-restify-mongoose');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
 

module.exports = function(app, config) {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  app.set('views', __dirname + '/../app/views');
  app.set('view engine', 'jade');

  // app.use(favicon('./public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static('./public'));
  app.use(methodOverride());

  var mongoSessionStore = new MongoDBStore(
  {
    uri: config.db,
    collection: 'sessions'
  });

  app.use(session({
    secret: 'a secret used to sign the session ID cookie',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
    },
    store: mongoSessionStore,
    resave: false,
    saveUninitialized: true
  }));

  require('./passport')(app, config);

  
  var userUri = restify.serve(app, require('../app/models/user'), {
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

  // var controllers = glob.sync(config.root + '/app/controllers/*.js');
  // controllers.forEach(function (controller) {
  //   require(controller)(app);
  // });

  app.use('/', require('../app/controllers/home'));  
  app.use('/api', require('../app/controllers/api'));

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      console.log(err.status, err);
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });

  return app;
};
