var mongoose = require('mongoose');

// Define our client schema
var Schema = new mongoose.Schema({
  _id: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true },
  history: [{}]
}, { collection: 'utente', discriminatorKey: '_type' , _id: false});

// Export the Mongoose model
module.exports = mongoose.model('Utente', Schema);