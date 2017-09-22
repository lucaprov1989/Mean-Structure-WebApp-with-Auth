exports.dispatch = function(req, res, controller) {

    if (req.params.id == undefined) {

        if (controller[req.params.action] == undefined) {

            req.params.id = req.params.action;
            req.params.action = "index";
        }
    }

    return controller[req.params.action](req, res);
}
