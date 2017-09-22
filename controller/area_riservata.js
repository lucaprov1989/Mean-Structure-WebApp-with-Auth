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
