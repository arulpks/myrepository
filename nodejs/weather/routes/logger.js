/*
* Logger:
*
* Log requests HTTP requests and its parameters to the console.
* 
* Examples:
*      var logger = require('./logger');
*      router.use('/',logger);   
*
*  @author Srinivasan Manoharan
*
*/


/*
* Module Dependencies
* This module has utilities for URL resolution and parsing
* 
*/

var url = require('url') ;

/*
*
* Method which logs details about the HTTP requests like host nmame ,
* HTTP verb, URL, Path, Parameters
*
*/

function logHttpRequest(request,response,next){	

    var todaysDate = new Date();
    // logs host, method , url and path.
    console.log(todaysDate +" Logger - HTTP HOST : " + request.host);
    console.log(todaysDate +" Logger - HTTP VERB : " + request.method);
    console.log(todaysDate +" Logger - HTTP URL  : " + request.url);
    console.log(todaysDate +" Logger - HTTP PATH : " + request.path);

    // if GET verb, get query prameters
    if(request.method == 'GET'){
        var urlObject = url.parse(request.url,true);
    	var queryJson = urlObject.query;

    	if(!(queryJson == undefined || queryJson == null)) {
            if(!(JSON.stringify(queryJson)=='{}')) {
    		  console.log(todaysDate +" Logger - HTTP GET QUERY PARAMETERS : " + JSON.stringify(queryJson));
          }
    	}

    }

    // if POST ,PUT verb , get post parameters
    if (request.method == 'POST' || request.method == 'PUT') {
        if(!(request.body == undefined || request.body== null)){
         console.log(todaysDate +" Logger - HTTP QUERY POST PARAMETERS : " + JSON.stringify(request.body));
        }
    }

    // Passes request to next matching roue.
    next();
}

// thie line exports the object, which lets other pecies of the code to use this object
module.exports =logHttpRequest;