# Weather Application 

  Weather application is a simple application built using Node.js and express which obtains weather data for Campbell, CA, Omaha, NE,
Austin, TX and Timonium, MD from underground api. Display the weather results in a table and omit any locations that fail to return data.

 The application also uses a Logger middleware on the server‐side

 Underground weather http://www.wunderground.com/


# Logger

 Logger is a middleware that will log to the console all parameters passed to the server via different
  methods of inputting data from a web app to the server (form, URL, etc). 
  For example, if the URL was http://localhost:8000/weather?name=foo it would log the fact that the name=foo was passed.

 Log requests HTTP requests and its parameters to the console.

  Examples:
     
     var logger = require('./logger');

     router.use('/',logger); 


  OUTPUT FORMAT :

    Sat Apr 19 2014 20:28:37 GMT-0400 (EDT) Logger - HTTP HOST : localhost.

    Sat Apr 19 2014 20:28:37 GMT-0400 (EDT) Logger - HTTP VERB : GET.

    Sat Apr 19 2014 20:28:37 GMT-0400 (EDT) Logger - HTTP URL  : /weather/conditions/current/fourcities?format=list.

    Sat Apr 19 2014 20:28:37 GMT-0400 (EDT) Logger - HTTP PATH : /weather/conditions/current/fourcities.

    Sat Apr 19 2014 20:28:37 GMT-0400 (EDT) Logger - HTTP GET QUERY PARAMETERS : {"format":"list"}.



# How to Set up the application locally

   1. clone the git project .

   2. Install Node js . 

   3. Install npm .

   4. run  node bin/www .


http://localhost:3000/

http://localhost:3000/weather/conditions/current?city=durham&state=NC

http://localhost:3000/weather/conditions/current/fourcities

http://localhost:3000/weather/conditions/current/fourcities?format=list


The application should have 5 hyperlinks and click on them to see the weather results in differrent formats.

The application also provides error details if they failed accordingly. 


