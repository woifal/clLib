var util = require('util');
var google = require('googleapis'),
    OAuth2 = google.auth.OAuth2;

var CLIENT_ID = "366201815473-t9u61cghvmf36kh0dgtenahgitvsuea8.apps.googleusercontent.com";
var CLIENT_SECRET = "366201815473-t9u61cghvmf36kh0dgtenahgitvsuea8@developer.gserviceaccount.com";
var REDIRECT_URL = "http://localhost:1983/verifyGoogleAuth";
                    
var oauth2Client =
    new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

// generates a url that allows offline access and asks permissions
// for Google+ scope.
var scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];




var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

// Retrieve tokens via token exchange explained above or set them:
oauth2Client.setCredentials({
  access_token: 'ya29.XQHR-Oe1furk_RU1FONiyT0JBSqn-H3P1QWOdfHtfXIsrspbkGNrpIaS'
  //,refresh_token: 'REFRESH TOKEN HERE'
});

var plus = google.plus('v1');

plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
  util.log("err >" + err + "<,>" + JSON.stringify(response) + "<");
  // handle err and response
});