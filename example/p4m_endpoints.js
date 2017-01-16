/*

The endpoints have been implemented in a minimal way, to allow
the widgets to function - this is NOT a full P4M implementation

*/

var Cookies     = require('cookies');
var request 	= require('request');

exports.getP4MAccessToken = function(req, res) {
	
	var cookies = new Cookies( req, res );

	if (cookies.get('p4mState') != req.query.state) {
	    res.status(500).send('Authentication error (p4mState)');
	}


	var url = "https://dev.parcelfor.me:44333/connect/token";

	var data = {
		grant_type		: "authorization_code",
		code			: req.query.code,
		redirect_uri	: "http://localhost:8081/p4m/getP4MAccessToken",
		client_id		: "10006"
	}

	var options = {
		url: url,
		headers: {
			"Authorization": "Basic " + new Buffer("10006:secret").toString('base64'),
			"Content-Type": "application/x-www-form-urlencoded"
		},
		form : data
	}

console.log(url);

	request.post(options, function(error, response, body) {


		res.status(200).send(body);
	});

console.log('wait for request cllback!');




};

exports.localLogin = function(req, res) {

	// see these cookies that are used by the other p4m widgets
	var now = new Date();
	var cookieConf = { path : '/', expires: new Date(now.setFullYear(now.getFullYear() + 1)) };
	cookies.set('p4mAvatarUrl', 		'http://localhost:8080/profile.jpg', cookieConf)
	cookies.set('p4mGivenName', 		'Adrian Aadvark', cookieConf)
	cookies.set('p4mDefaultPostCode', 	'4000', cookieConf)
	cookies.set('p4mDefaultCountryCode', 'AU', cookieConf)
	cookies.set('p4mOfferCartRestore', 	'true', cookieConf)
	cookies.set('p4mLocalLogin', 		'true', cookieConf)

	res.status(200).json({ "RedirectUrl": null, "Success": true, "Error": null});

};

exports.checkout = function(req, res) {

}

