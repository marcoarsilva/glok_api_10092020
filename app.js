var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var methods = require("methods");
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');
var conf = require('./configs.js');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var companyRouter = require('./routes/company');
var logRouter = require('./routes/log');
var deviceRouter = require('./routes/device');
var authRouter = require('./routes/auth');
var areaRouter = require('./routes/area');
var historyRouter = require('./routes/history');
var analyticRouter = require('./routes/analytic');

var app = express();

mongoose.connect( conf.mongodb,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false
  }
)
.then(() => console.log('Connected'))
.catch(err => console.log('Couldnt connect to DB', err.stack));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//C
// ORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/company', companyRouter);
app.use('/api/user', usersRouter);
app.use('/api/log', logRouter);
app.use('/api/areaLog', historyRouter );
app.use('/api/device', deviceRouter);
app.use('/api/area', areaRouter);
app.use('/api/auth', authRouter);
app.use('/api/analytic', analyticRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  app.locals.pretty = true;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
