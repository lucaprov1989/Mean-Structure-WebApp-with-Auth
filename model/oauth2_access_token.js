var mongoose = require('mongoose');

// Define our client schema
var Schema = new mongoose.Schema({
  _id: { type: String, unique: true, required: true },
  session: {},
  expire_time: { type: Date, required: true },
  scopes: [String]
}, { collection: 'oauth2_access_token', _id: false});

// Export the Mongoose model
module.exports = mongoose.model('OAuth2AccessToken', Schema);