/*

The endpoints have been implemented in a minimal way, to allow
the widgets to function - this is NOT a full P4M implementation

*/

var Cookies     = require('cookies');
var OidcClient  = require('oidc-client-node');



exports.getP4MAccessToken = function(req, res) {
	
	var cookies = new Cookies( req, res );
	
	if (cookies.get('p4mState') != req.param.state) {
	    res.status(500).send('Authentication error (p4mState)');
	}
	
	var oidcConfig = {
	  scope: 'p4mApi p4mRetail', 
	  client_id: '10004',
	  client_secret: 'secret',
	  callbackURL: '/auth/oidc/callback',
	  post_logout_redirect_uri: 'http://'+req.headers.host+':8080/p4m/getP4MAccessToken',
	  authority: 'https://dev.parcelfor.me:44333/connect/token',
	  response_type: "code", 
	  response_mode: "form_post",
	  scopeSeparator: ' ',
	  verbose_logging: true,

	  jwks_uri: 'https://dev.parcelfor.me:44333/.well-known/openid-configuration/jwks'
	  
	};

	var oidcClient = new OidcClient(req, res, oidcConfig);
	
	var tokenRequest = oidcClient.createTokenRequestAsync();
	
    tokenRequest.then(function (results) {
        console.log('success from oidc token request', results);
        
        var now = new Date();
        cookies.set('p4mToken', results.accessToken,
                    { path : '/', expires: new Date(now.setFullYear(now.getFullYear() + 1)) });
                    
        
        res.status(200).send('<script>window.close();</script>');
        
    }).catch(function(error){
        console.log('ERROR :', error);
        res.status(500).send('OIDC error: ' + error);
    });


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

