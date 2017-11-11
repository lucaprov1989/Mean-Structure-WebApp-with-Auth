var passport = require('passport');
var passport_http = require('passport-http');
var oauth2_client = require('../model/oauth2_client');

/*New Instance of Passport Class for standard authentication*/

passport.use('client-basic', new passport_http.BasicStrategy(
  function(username, password, callback) {

    oauth2_client.findOne({ _id: username }, function (err, client) {
      if (err) { return callback(err); }

      if (!client || client.secret !== password) { return callback(null, false); }

      return callback(null, client);
    });
  }
));

exports.auth = passport.authenticate('client-basic', { session : false });
