/*

The endpoints have been implemented in a minimal way, to allow
the widgets to function - this is NOT a full P4M implementation

*/

var Express = require('express');

var Cookies     	= require('cookies');
var request 		= require('request');
var fs				= require('fs');


exports.getP4MAccessToken = function(req, res) {
	res.status(200).send('<html><body></body></html>');
	res.end(); 

}

exports.postP4MAccessToken = function(req, res) {
	var cookies = new Cookies( req, res );

	// if (cookies.get('p4mState') != req.query.state) {
	//     res.status(500).send('Authentication error (p4mState)');
	// }
	// else {
		var values = req.body;// JSON.parse(req.body);
		console.log("Access token: " + values.access_token);
		var cookieConf = { path : '/', expires: null, httpOnly: false };
		cookies.set('p4mToken', values.access_token, cookieConf);
		cookies.set('p4mTokenExpires', expiresAt.toUTCString(), cookieConf);
		var d = new Date(Date.now());
		d.setDate(d.getDate()+365); 
		cookieConf.expires = d;
		cookies.set('p4mHasAccount', 'Y', cookieConf);
		
		res.status(200).send('<script>window.close();</script>');
		res.end(); // needed for cookies to save !
	//}

/*
	var url = "https://dev-ids.parcelfor.me/connect/token";

	var data = {
		grant_type		: "authorization_code",
		code			: req.query.code,
		redirect_uri	: "http://localhost:8080/p4m/getP4MAccessToken",
		client_id		: "10006"
	}

	var options = {
		url: url,
		headers: {
			"Authorization": "Basic " + new Buffer("10006:secret").toString('base64'),
			"Content-Type": "application/x-www-form-urlencoded"
		},
		port: 443,

		form : data,
	
		rejectUnauthorized : false

	}


	function isEmptyObject(obj) {
		return !Object.keys(obj).length;
	}

	request.post(options, function(error, response, body) {

		if (error && !isEmptyObject(error)) {
			res.status(500).send(error);
		}

		var now = new Date();
		var cookieConf = { path : '/', expires: new Date(now.setFullYear(now.getFullYear() + 1)) , httpOnly: false };
		console.log(body);
		cookies.set('p4mToken', JSON.parse(body).access_token, cookieConf);

		res.status(200).send('<script>window.close();</script>');
		res.end(); // needed for cookies to save !
	});
*/

};


exports.localLogin = function(req, res) {

	var cookies = new Cookies( req, res );

	// see these cookies that are used by the other p4m widgets
	// var now = new Date();
	// var cookieConf = { path : '/', expires: new Date(now.setFullYear(now.getFullYear() + 1)) , httpOnly: false };
	// cookies.set('p4mAvatarUrl', 		'http://localhost:8080/profile.png', cookieConf);
	// cookies.set('p4mGivenName', 		'Hugo', cookieConf);
	// cookies.set('p4mOfferCartRestore', 	'true', cookieConf);
	// cookies.set('p4mLocalLogin', 		'true', cookieConf); 

	res.status(200).json({ "localId": "1234567", "redirectUrl": null, "success": true, "error": null});
	res.end(); // needed for cookies to save !
};


exports.localLogout = function(req, res) {
	
	var cookies = new Cookies( req, res );
	cookies.set("p4mToken", {expires: Date.now()});
	cookies.set("p4mTokenExpires", {expires: Date.now()});
	cookies.set("p4mAvatarUrl", {expires: Date.now()});
	cookies.set("p4mGivenName", {expires: Date.now()});
	cookies.set("p4mLocalLogin", {expires: Date.now()});
	cookies.set("p4mState", {expires: Date.now()});
	cookies.set("p4mNonce", {expires: Date.now()});
	cookies.set("p4mOfferCartRestore", {expires: Date.now()});
	cookies.set("p4mLocale", {expires: Date.now()});
	cookies.set("p4mConsumer", {expires: Date.now()});
	cookies.set("p4mPrefAddress", {expires: Date.now()});
	cookies.set("p4mCart", {expires: Date.now()});
	cookies.set("p4mCartAddress", {expires: Date.now()});
	cookies.set("gfsCheckoutToken", {expires: Date.now()});
	res.redirect("/");
	res.end(); // needed for cookies to save !
};


exports.checkout = function(req, res) {
	returnTemplateFile('checkout.html', null, null, res);
}


exports.renewShippingToken = function(req, res) {

	var cookies = new Cookies( req, res );
	var url = "https://identity.justshoutgfs.com/connect/token";

	var data = {
		grant_type	: "client_credentials",
		scope 		: "read checkout-api"
	}

	var options = {
		url: url,
		headers: {
			"Authorization": "Basic " + Buffer.from("parcel_4_me:needmoreparcels").toString('base64'),
			//"Authorization": "Basic " + Buffer.from("michael.strong@justshoutgfs.com:MScheckout!").toString('base64'),
			"Content-Type": "application/x-www-form-urlencoded"
		},
		form : data
	}

	request.post(options, function(error, response, body) {
		console.log(body);
		var data = JSON.parse(body);
		var now = new Date();
		var cookieConf = { path : '/', expires: new Date(now.setFullYear(now.getFullYear() + 1)) , httpOnly: false };
		cookies.set('gfsCheckoutToken', data.access_token, cookieConf);

		res.status(200).json({ "token": data.access_token, "success": true, "error": null});
		res.end(); // needed for cookies to save !		
	});
}


exports.itemQtyChanged = function(req, res) {
    var result = {
        success: true
    };
    res.status(200).json(result);
}

function returnTemplateFile(file, find, replace, res) {

	fs.readFile('static_api/templates/'+file, function read(err, file_contents) {
		if (err) {
			res.status(500).send(err);
		}
		// IMPLEMENTING ONLY THE MOST BASIC FIND REPLACE, OF ONE SHORT CODE AND ONLY ONE OCCURANCE
		if (find)
			file_contents = file_contents.toString('utf8').replace(find, replace);  

		res.set('Content-Type', 'text/html');
		res.status(200).send(file_contents);
		res.end(); // needed for cookies to save !
	});
}

exports.updShippingService = function(req, res) {
    var result = {
        discount: 0,
        error: null,
        shipping: req.body.Amount,
        success: true
    };
    try {
		result.tax = Math.floor(result.shipping / 10);
		result.total = result.tax + result.shipping;
    }
    catch(e) {
    	console.error(e);
    	result.tax = 0;
    	result.total = result.shipping;
    }
    res.status(200).json(result);
}

exports.applyDiscountCode = function(req, res) {
	if (req.body.discountCode && req.body.discountCode.length && req.body.discountCode[0].toLowerCase() == "f") {
		res.status(200).json(
			{
				"code": req.body.discountCode,
				"valid": true,
				"amount": 10.0,
				"description": "Special discount",
				"note": "Special discount"
			}
		);
	}
	else {
		res.status(200).json(
			{
				"code": req.body.discountCode,
				"valid": false,
				"error": "Not a valid code"
			}
		);

	}
}