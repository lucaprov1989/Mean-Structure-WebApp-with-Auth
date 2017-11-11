
/*Backend Controller for the user actions, more actions need to be implemented*/

var mongoose = require('mongoose');
var controller_common = require('./common');
var utente = require('../model/utente');

var controller = {
    _name: "utente",
    index: function(req, res) {
        res.json(req.user);
        return;

    }
};


exports.execute = function(req, res) {
    controller_common.dispatch(req, res, controller);
};
