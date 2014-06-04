/*
*
*   This javascript has functions which makes the rest call to undergound 
*   weather API for each of the cities asynchronously and combines the  
*   response into to a Json array and sends the response back in a tabular 
*   format or list format.
*    
*    This is a rest client only for the below REST CALL format .  
*    API URL format :- http://api.wunderground.com/api/a8b8e803c1476203/conditions/q/CA/San_Francisco.json
*
*  @author Srinivasan Manoharan
*
*/

/*
* 
* Module dependencies
* 
*/

var async = require('async');
var https = require('https');

// host name for the Weather api 
var host = 'api.wunderground.com';

// Developer api key for the site
var apikey = 'a8b8e803c1476203';

// Set up options like host , method ,etc for REST call.
var options = {
    host: host,
    method: 'GET',
    headers: {}
};


/*
*
*  This method takes a list of locations makes rest api calls to underground weather server and gets the JSon
*  response back and parses them and ignores the invalid ones.
*
*/

function getCurrentWeatherConditionsForLocations(request,response,locations,view,throwError,next){

     // make rest calls for all the locations and push them into a single Results array using Async module. 
	 async.map(locations,function(location,callback){
        // Extract the city and state from the array.
        var state = location.state.replace(' ','_'), city = location.city.replace(' ','_');


        //Sets up the options  path (endpoint) for the REST call  for weather underground
        options['path'] = '/api/' + apikey +'/conditions/q/'+ state+'/'+ city +'.json';

        console.info("REST client call : " + options['path']);

        // makes the HTTP request to REST API and also set a callback for response.
        var restRequest = https.request(options,function (restResponse) {
            var responseData = '';
            
            // call back called when 'data' event is emitted, appends the data to a response string.
            restResponse.on('data', function(data){
                responseData += data;
            });

            // call back is called when 'end' event is emitted
            restResponse.on('end', function(){
                callback(null,JSON.parse(responseData));
            });               
         });

         restRequest.on('error', function (err) {
            next(err);
         });

         // completes the request    
         restRequest.end();

    }, function(err,results){

        if(err) {
            next(err);
        }
        
        var weatherConditionResults = processValidWeatherResponse(results, throwError, next);
         
        // condition is true when there is no valid JSON responses with current_observation tag
        if(weatherConditionResults.length == 0){

            // This is a user defined error to let the user know there is no valid response 
             var err = new Error('No valid weather Data found');
             err.status = 500;
             next(err);
        }

        // will render the JSON object to the view.
        response.render(view, { weatherConditions : weatherConditionResults});
    });

}

/*
* This function parses the response and inserts the valid response into weatherConditionResults.
*/

function processValidWeatherResponse(results, throwError, next){
    /* DEVNOTE: reason using another array  called weatherConditionResults to keep track of valid responses
       is because splice()  does not work with certain IE browsers like ie 8 and lesser. */  

        var weatherConditionResults = [];
        for (i=0;i<results.length;i++){

          if(checkIfResponseContainsCurrentObservationTag(results[i],throwError,next) === true){
            // add the valid json response to weathersJson
            weatherConditionResults.push(results[i]);
          }
        }

    return weatherConditionResults;    
}

 /*
   * This function parses the response and checks if the response is valid
   * throws a error if the throwerror flag is true else omits the error.
   */
function checkIfResponseContainsCurrentObservationTag(result , throwError, next){

  var response = result.response;
  if (!(response === undefined || response === null)){  
    var error = result.response.error;
    if (!(error === undefined || error === null)) {
      // this block executes only when there is a response.error tag in the response json.
      var errorMessage = 'Error:'+error.type + 'Message :'+ error.description ;
      if(throwError === true){
          createErrorAndRouteThemToNextHandler(errorMessage,500,next);
       } else {
         console.info(errorMessage + error.description);
         return false;
       }      
    } 

    var currentObservation = result.current_observation ;
    if(currentObservation === undefined || currentObservation === null) { 
      var suggestions = getSuggestedLocations(response);
      // this block executes only when there is a response.current_observation tag in the response json.  
      if(throwError === true ) {
        var err ;
        // if suggestions is empty then no valid location results were received.
        if(suggestions === ''){
         createErrorAndRouteThemToNextHandler('Current Observation Tag is not found in Json',500,next);
        } else {
         createErrorAndRouteThemToNextHandler('Not a valid location - Suggestions:'+ suggestions,500,next);
         } 
       } else {
        if(suggestions === ''){
          console.info('Current Observation Tag is not found in Json');
        } else {
          console.info('Not a valid location - Suggestions:'+ suggestions);
        }
        return false;
      }
    } else {
        // return true because its a valid json.
        return true;
    }
  }  
  return false;
}

/*
* function which checks if the response has results tag , if yes then gets
* the list of city and states.
*/ 
function getSuggestedLocations(response){
    var suggestions ='';
    if(!(response.results === undefined || response.results === null) ) {
      for(i=0;i<response.results.length;i++){
        suggestions += '\n' + response.results[i].city +',' + response.results[i].state ;
      }
    }
    return suggestions;
}

/*
* This functions creates errors and passes to the next handler
*/
function createErrorAndRouteThemToNextHandler(message,status,next){
  var err = new Error(message);
  err.status = status;
  next(err);
}


exports = module.exports.getCurrentWeatherConditionsForLocations = getCurrentWeatherConditionsForLocations;