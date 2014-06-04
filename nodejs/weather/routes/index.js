/*
*
*   This is the main route page which has the resources for root path 
*   and / weather/all path  - which makes the rest call to undergound 
*   weather API for each of the cities asynchronously and combines the  
*   response into to a Json array and sends the response back in a tabular 
*   format or list format.
*
*  @author Srinivasan Manoharan
*
*/

/*
* 
* Module dependencies
*   : Loads the express module , router , Async module , Logger middleware ,
*      https module and weather.api.rest.client module.
*/

var express = require('express');
var router = express.Router();
var async = require('async');
var logger = require('./logger');
var https = require('https');

var weatherApiRestClient = require('./weather.api.rest.client');

// loads A config utility for node.js, that uses a single JavaScript file with an export JavaScript object.
var Config = require('config-js');

// loads the configuration properties from path /conf/app_properies.js
var config = new Config('./conf/app_properties.js');

// get the locations varibale from the properties files
var locations = config.get('locations');

//Defined Routes /////////       

// sets the logger middleware to prints out the request to the console for all the requests
router.use('/',logger);

// route for / path and renders to index view.
router.get('/', function(req, res) {
  res.render('index');
});

// route for /weather/get and renders to get-weather view
router.get('/weather/get',function(req,res){
  res.render('get-weather');
});

// route for /weather/post and renders the post-weather view
router.get('/weather/post',function(req,res){
  res.render('post-weather');
});

// route for /weather/current/conditions/fourcities
router.get('/weather/conditions/current/fourcities',function(request,response,next){
    
	var view = getViewBasedOnDisplayFormat(request.query.format);
    
    // gets current weather conditions for locations and ignores any error thrown. 
    weatherApiRestClient.getCurrentWeatherConditionsForLocations(request,response,locations,view,false,next); 
});

// route for weather/conditions/current?city=durham&state=NC
router.get('/weather/conditions/current',function(request,response,next){

    //get get query paramers
    var city = request.query.city , state = request.query.state ;
    var view = getViewBasedOnDisplayFormat(request.query.format);
    var locations =[{city: city,state :state}];

    // gets current weather conditions for locations and throws any errors.
    weatherApiRestClient.getCurrentWeatherConditionsForLocations(request,response,locations,view,true ,next);
});

// route for weather/conditions/current  Post request
router.post('/weather/conditions/current', function(request,response,next){

    // get post paramters
    var city = request.param('city') , state = request.param('state');
    var view = getViewBasedOnDisplayFormat(request.param('format'));
    var locations =[{city: city,state :state}];

    // gets current weather conditions for locations and throws any errors.
    weatherApiRestClient.getCurrentWeatherConditionsForLocations(request,response,locations,view,true,next);
});

/*
* This function determines which view to use to display based on the display format.
*/

function getViewBasedOnDisplayFormat(displayFormat){
    var lowerCaseFormat = '';
    var view='';
    
    if(!(displayFormat === null || displayFormat === undefined)){
        lowerCaseFormat = displayFormat.toLowerCase();
    } 
    
    // set view to weather-list or weather-table based on format
    if(lowerCaseFormat=='list'){
        view ='weather-list';
    } else {
        view = 'weather-table';
    }
    return view;
}

// thie line exports the object, which lets other pecies of the code to use this object.
module.exports = router;