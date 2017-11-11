var oauth2orize = require('oauth2orize');
var mongoose = require('../config/mongodb');
var utils = require('./utils.js');
var crypto = require('crypto');

var oauth2_client = require('../model/oauth2_client');
var oauth2_access_token = require('../model/oauth2_access_token');
var oauth2_refresh_token = require('../model/oauth2_refresh_token');

var utente = require('../model/utente');

var server = oauth2orize.createServer();

server.serializeClient(function(client, done) {
  console.log("serializeClient");
  return done(null, client._id);
});

server.deserializeClient(function(id, done) {
  console.log("deserializeClient");
  oauth2_client.findOne({ _id: id}, function(err, client) {
    if (err) { return done(err); }
    return done(null, client);
  });
});

server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {


    /*Validate the client*/
    oauth2_client.findOne({_id: client._id}, function(err, localClient) {
        if (err) { return done(err); }
        if(localClient === null) {
            return done(null, false);
        }
        if(localClient.secret !== client.secret) {
            return done(null, false);
        }

        //Validate the user
        utente.findOne({_id: username}, function(err, user) {
            var u = JSON.parse(JSON.stringify(user));
            if(client._id == "webclient" && u._type == "Candidato"){
                return done(null, false);
            }
            if (err) { return done(err); }
            if(user === null) {
                return done(null, false);
            }
            var md5Hash = crypto.createHash('md5');
            md5Hash.update(password);
            if(md5Hash.digest("hex") !== user.password) {
                return done(null, false);
            }

            //Everything validated, return the token
            var expire_time = new Date();
            expire_time.setHours(expire_time.getHours() + 2);
            if(client._id != "webclient"){
                var expire_time = new Date();
                expire_time.setFullYear(expire_time.getFullYear() + 2);
            }
            var token = new oauth2_access_token({
                _id: utils.uid(64),
                session: {client_id: client._id, owner_id: username},
                expire_time: expire_time,
                scope: [scope]
            });
            token.save(function(err){
                if (err) return done(err);
                // Inserting the refresh token
                var refresh = new oauth2_refresh_token({
                    _id: utils.uid(64),
                    expire_time: expire_time,
                    token: token._id
                });
                //save the token
                refresh.save(function(err){
                    if (err) return done(err);
                    done(null, token, refresh._id);
                });
            });
        });
    });
}));

server.exchange(oauth2orize.exchange.refreshToken(function(client, refresh_token, scope, done) {

    //Validate the client
    oauth2_client.findOne({_id: client._id}, function(err, localClient) {
        if (err) { return done(err); }
        if(localClient === null) {
            return done(null, false);
        }
        if(localClient.secret !== client.secret) {
            return done(null, false);
        }

        oauth2_refresh_token.findOne({_id: refresh_token},function(err, refresh){
            if (err) { return done(err); }
            if(refresh === null) {
                return done(null, false);
            }

            var now = new Date();
            if(now.getTime() - refresh.expire_time.getTime() > 0) {
              return callback(null, false);
            }

            oauth2_access_token.findOne({ _id: refresh.token }, function (err, token) {
                if (err) { return callback(err); }
                if (!token) { return doen(null, false); }

                var now = new Date();
                if(now.getTime() - token.expire_time.getTime() > 0) {
                    return done(null, false);
                }

                //Everything validated, return the token
                var expire_time = new Date();
                expire_time.setHours(expire_time.getHours() + 2);
                var new_token = new oauth2_access_token({
                    _id: utils.uid(64),
                    session: token.session,
                    expire_time: expire_time,
                    scope: token.scope
                });
                new_token.save(function(err){
                    if (err) return done(err);
                    // Inserire il refresh token
                    var new_refresh = new oauth2_refresh_token({
                        _id: utils.uid(64),
                        expire_time: expire_time,
                        token: new_token._id
                    });
                    new_refresh.save(function(err){
                        if (err) return done(err);
                        done(null, new_token, new_refresh._id);
                    });
                });
            });
        });
    });
}));

// Application client token exchange endpoint
exports.auth = [
  server.token(),
  server.errorHandler()
]
