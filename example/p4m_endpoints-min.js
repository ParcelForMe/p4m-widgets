function returnTemplateFile(e,t,o,s){fs.readFile("static_api/templates/"+e,function e(n,r){n&&s.status(500).send(n),t&&(r=r.toString("utf8").replace(t,o)),s.set("Content-Type","text/html"),s.status(200).send(r),s.end()})}var Express=require("express"),Cookies=require("cookies"),request=require("request"),fs=require("fs");exports.getP4MAccessToken=function(e,t){function o(e){return!Object.keys(e).length}var s=new Cookies(e,t);s.get("p4mState")!=e.query.state&&t.status(500).send("Authentication error (p4mState)");var n="https://dev-ids.parcelfor.me/connect/token",r={grant_type:"authorization_code",code:e.query.code,redirect_uri:"http://localhost:8080/p4m/getP4MAccessToken",client_id:"10006"},a={url:n,headers:{Authorization:"Basic "+new Buffer("10006:secret").toString("base64"),"Content-Type":"application/x-www-form-urlencoded"},port:443,form:r,rejectUnauthorized:!1};request.post(a,function(e,n,r){e&&!o(e)&&t.status(500).send(e);var a=new Date,c={path:"/",expires:new Date(a.setFullYear(a.getFullYear()+1)),httpOnly:!1};console.log(r),s.set("p4mToken",JSON.parse(r).access_token,c),t.status(200).send("<script>window.close();</script>"),t.end()})},exports.localLogin=function(e,t){var o=new Cookies(e,t),s=new Date,n={path:"/",expires:new Date(s.setFullYear(s.getFullYear()+1)),httpOnly:!1};o.set("p4mAvatarUrl","http://localhost:8080/profile.png",n),o.set("p4mGivenName","Hugo",n),o.set("p4mOfferCartRestore","true",n),o.set("p4mLocalLogin","true",n),t.status(200).json({localId:"1234567",redirectUrl:null,success:!0,error:null}),t.end()},exports.checkout=function(e,t){returnTemplateFile("checkout.html",null,null,t)},exports.renewShippingToken=function(e,t){var o=new Cookies(e,t),s="https://identity.justshoutgfs.com/connect/token",n={grant_type:"client_credentials",scope:"read checkout-api"},r={url:s,headers:{Authorization:"Basic "+Buffer.from("parcel_4_me:needmoreparcels").toString("base64"),"Content-Type":"application/x-www-form-urlencoded"},form:n};request.post(r,function(e,s,n){console.log(n);var r=JSON.parse(n),a=new Date,c={path:"/",expires:new Date(a.setFullYear(a.getFullYear()+1)),httpOnly:!1};o.set("gfsCheckoutToken",r.access_token,c),t.status(200).json({token:r.access_token,success:!0,error:null}),t.end()})},exports.itemQtyChanged=function(e,t){var o={success:!0};t.status(200).json(o)},exports.updShippingService=function(e,t){var o={discount:0,error:null,shipping:e.body.Amount,success:!0};try{o.tax=Math.floor(o.shipping/10),o.total=o.tax+o.shipping}catch(e){console.error(e),o.tax=0,o.total=o.shipping}t.status(200).json(o)},exports.applyDiscountCode=function(e,t){e.body.discountCode&&e.body.discountCode.length&&"f"==e.body.discountCode[0].toLowerCase()?t.status(200).json({code:e.body.discountCode,valid:!0,amount:10,description:"Special discount",note:"Special discount"}):t.status(200).json({code:e.body.discountCode,valid:!1,error:"Not a valid code"})};