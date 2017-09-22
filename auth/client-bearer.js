var passport = require('passport');
var passport_bearer = require('passport-http-bearer');
var oauth2_access_token = require('../model/oauth2_access_token');
var utente = require('../model/utente');

passport.use('client-bearer', new passport_bearer.Strategy(
  function(token, callback) {
    
    oauth2_access_token.findOne({ _id: token }, function (err, token) {
      if (err) { return callback(err); }
      if (!token) { return callback(null, false); }
    
      var now = new Date();
      if(now.getTime() - token.expire_time.getTime() > 0) { 
          return callback(null, false); 
      }
    
      utente.findOne({_id: token.session.owner_id}, function(err, user){
          if (err) { return callback(err); }
          return callback(null, user);
      });
    });
  }
));

exports.auth = passport.authenticate('client-bearer', { session : false });