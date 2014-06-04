/*
*
* This javascript file sets the basic settings for the modules used , intialises the express application ,
* sets the Jade template engines , the differrent routes, and also has some error handlers 
* for No resource found , and other errors based on development mode or production mode .
*
* @ author Srinivasn Manoharan
*
*/

/*
* 
* Module dependencies
* 
*/
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// instantiates express application
var app = express();


// sets view engine to jade template engine and where the jade templates are located
// where the jade files are kept. 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// defines where the static elements are located like css, images, etc
app.use(express.static(path.join(__dirname, 'public')));


// defines where the routes are located 
var routes = require('./routes/index');
app.use('/', routes);


// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Resource Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            error: err
        });
    });
}

// production error handler no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// exports the module, which lets other pieces of the code to use this modules
module.exports = app;
