var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var appRouter = require('./routes/login/appLogin');
var kakaoRouter = require('./routes/login/kakaoLogin');
var naverRouter = require('./routes/login/naverLogin');
var googleRouter = require('./routes/login/googleLogin');

var app = express();
// ADD: cors
var cors = require('cors');
app.use(cors());

var maria = require('./database/connect/maria');
maria.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/index', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/login/appLogin', appRouter);
app.use('/api/login/kakaoLogin', kakaoRouter);
app.use('/api/login/naverLogin', naverRouter);
app.use('/api/login/googleLogin', googleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

console.log("start");

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
