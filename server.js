var LISTEN_PORT = 4000;

var express = require('express');
var body_parser = require('body-parser');
var oauth2 = require('./auth/oauth2');
var client_basic = require('./auth/client-basic');
var client_bearer = require('./auth/client-bearer');
var cors = require('cors');
var utente_controller = require('./controller/utente');
var area_riservata_controller = require('./controller/area_riservata');

var multer = require('multer')
var upload = multer({
    dest: 'tmp/'
})

var app = express();

/*app.use(body_parser.urlencoded({extended: true}));*/
app.use(body_parser.json({
    extended: true,
    limit: '50mb'
}));

/* Public client */
app.use('/', express.static(__dirname + '/public'));

app.use(cors({
    origin: '*',
    allowedHeaders: ["X-Requested-With", "Content-Type", "Authorization"]
}));

/* API */
var router = express.Router();

/* Autenticazione */
router.route('/oauth2/token')
    .post(client_basic.auth, oauth2.auth);

/* Utente */
router.route('/utente/:action?/:id?')
    .get(client_bearer.auth, utente_controller.execute)
    .put(client_bearer.auth, utente_controller.execute);

/* Progetto */
router.route('/area_riservata/:action?/:id?')
    .get(client_bearer.auth, area_riservata_controller.execute)
    .post(client_bearer.auth, upload.any(), area_riservata_controller.execute);


app.use('/api', router);

var server = app.listen(LISTEN_PORT);
//}
