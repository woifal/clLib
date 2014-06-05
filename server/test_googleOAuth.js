var googleapis = require('googleapis'),
    OAuth2 = googleapis.auth.OAuth2;

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

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes.join(" ") // space delimited string of scopes
});

console.log("URL IS >" + url + "<");