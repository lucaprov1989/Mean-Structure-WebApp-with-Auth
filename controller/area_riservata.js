
/*Controller for the area's actions only for logged users, more actions need to be implemented*/
var mongoose = require('../config/mongodb');
var controller_common = require('./common');

var controller = {
    _name: "area_riservata",
    index: function(req, res) {
        res.json('ci sono!');
        return;

    }

};

exports.execute = function(req, res) {

    controller_common.dispatch(req, res, controller);
};
