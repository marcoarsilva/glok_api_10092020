var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var companyRouter = require('./routes/company');
var logRouter = require('./routes/log');
var deviceRouter = require('./routes/device');
var sigfoxRouter = require('./routes/sigfox');
var authRouter = require('./routes/auth')

var app = express();

//connect to database
mongoose.connect('mongodb://localhost:27017/glok_test', {useNewUrlParser: true});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/company', companyRouter);
app.use('/api/user', usersRouter);


/* app.use('/api/log', logRouter);
app.use('/api/device', deviceRouter);
app.use('/api/sigfox', sigfoxRouter); */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
