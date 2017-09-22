var mongoose = require('mongoose');

// Define our client schema
var Schema = new mongoose.Schema({
  _id: { type: String, unique: true, required: true },
  secret: { type: String, required: true },
  name: { type: String, required: true },
  redirect_uri: String
}, { collection: 'oauth2_client', _id: false});

// Export the Mongoose model
module.exports = mongoose.model('OAuth2Client', Schema);