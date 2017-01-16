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


	request.post(options, function(error, response, body) {

		var now = new Date();
		var cookieConf = { path : '/', expires: new Date(now.setFullYear(now.getFullYear() + 1)) , httpOnly: false };

		cookies.set('p4mToken', JSON.parse(body).access_token, cookieConf);

		res.status(200).send('<script>window.close();</script>');
		res.end(); // needed for cookies to save !
	});


};

exports.localLogin = function(req, res) {

console.log('**** LOCAL LOGIN CALLED !!!');


	// see these cookies that are used by the other p4m widgets
	var now = new Date();
	var cookieConf = { path : '/', expires: new Date(now.setFullYear(now.getFullYear() + 1)) , httpOnly: false };
	cookies.set('p4mAvatarUrl', 		'http://localhost:8080/profile.jpg', cookieConf);
	cookies.set('p4mGivenName', 		'Adrian Aadvark', cookieConf);
	cookies.set('p4mDefaultPostCode', 	'4000', cookieConf);
	cookies.set('p4mDefaultCountryCode', 'AU', cookieConf);
	cookies.set('p4mOfferCartRestore', 	'true', cookieConf);
	cookies.set('p4mLocalLogin', 		'true', cookieConf); 

	res.status(200).json({ "RedirectUrl": null, "Success": true, "Error": null});
	res.end(); // needed for cookies to save !
};

exports.checkout = function(req, res) {

}

