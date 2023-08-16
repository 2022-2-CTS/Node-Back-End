var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var apiRouter = require('./routes/apidata/getapi');
var postRouter = require('./routes/post/post');
var favoriteRouter = require('./routes/mydata/favorite');

//로그인 라우터
var loginRouter = require('./routes/login');
var signupRouter = require("./routes/signup")


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

app.use('/api/post',postRouter);
app.use('/api/event',apiRouter);
app.use('/api/mydata/favorite', favoriteRouter);

//로그인 라우터
app.use('/api/login/', loginRouter);
app.use('/api/login/kakao', loginRouter);
app.use('/api/login/naver', loginRouter);
app.use('/api/signup', signupRouter);


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
