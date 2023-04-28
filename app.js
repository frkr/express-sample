//region Imports
var express = require('express');
var createError = require('http-errors');
var path = require('path');
// var cookieParser = require('cookie-parser'); // Security
var logger = require('morgan');

// Security
var helmet = require('helmet');
var rateLimiterAuth = require('./middleware/rateLimiterAuth');

//endregion

//region Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//endregion

//region Express
var app = express();

// Security
app.use(helmet());
app.use(rateLimiterAuth);
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger(process.env.DEBUG ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(cookieParser()); // Security
app.use(express.static(path.join(__dirname, 'public')));

//endregion

//region Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
//endregion

//region Catch and forward to error handler
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    // TODO testar
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
//endregion

module.exports = app;
