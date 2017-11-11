
/*MongoDB Settings*/
var mongoose = require('mongoose');
mongoose.connect('mongodb://insertsettings');
exports.mongoose = mongoose;
