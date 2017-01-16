var Express 		= require('express');
var Http			= require('http');
var BodyParser		= require('body-parser');

var p4mEndpoint 	= require('./p4m_endpoints.js');


var SITE_PORT = 8080;
var API_PORT = 8081;

//--- Helper middleware functions
function allowCrossDomain(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH,FILE');
	res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
	next();
};

function addApiHeaders(req, res, next) {
	res.header('Content-Type', 'application/json');
	next();
};

function simulateDelay(req, res, next) {
	console.log('Waiting for 3 seconds..');
	setTimeout(next, 3000);
}

function logRoute(req, res, next) {
	var fullUrl = /*'req.protocol + '://'*/ ' ' + req.get('host') + req.originalUrl;
	console.log(fullUrl);
	next();
}



//--- Set up site and API servers
var site = Express();
var api = Express();

site.use(allowCrossDomain);
site.set('port', SITE_PORT);

api.use(BodyParser.json());
api.use(allowCrossDomain);
api.set('port', API_PORT);



//--- API Routing

api.use(logRoute);

/* 

These are the minimum parcel 4 me endpoints we need to implement so 
that the widgets will actually work

*/
api.use('/p4m/getP4MAccessToken', p4mEndpoint.getP4MAccessToken); 
api.use('/p4m/localLogin', p4mEndpoint.localLogin); 
api.use('/p4m/checkout', p4mEndpoint.checkout); 

// TODO : check if discount code is valid or not ("AAA" is valid !)
api.use('/p3m/applyDiscountCode', simulateDelay); // and then continue on to static file

/*

At this stage all other endpoints are handled by a static file (per endpoint)
Hard-coded sample data

*/
api.use(Express.static('static_api')); 



api.use(addApiHeaders);

api.get('/', function(req, res)
{
	res.status(200).send("Local API");
});


//--- Routing for index.html and widgets 
site.use('/lib/p4m-widgets', Express.static('..'));
site.use('/lib', Express.static('../bower_components'));
site.use(Express.static('.'));


//--- Start servers
Http.createServer(api).listen(API_PORT);
console.log("API server listening on", API_PORT);

Http.createServer(site).listen(SITE_PORT);
console.log("Site server listening on", SITE_PORT);

//--- Exception safety net
process.on('uncaughtException', function(err) {
	console.log("Unhandled exception:", err.stack);
});
