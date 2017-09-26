var mongoose = require('mongoose');
mongoose.connect('mongodb://formulario.tornosubito.laziodisu.it:27017/tornosubio_dev');
exports.mongoose = mongoose;
