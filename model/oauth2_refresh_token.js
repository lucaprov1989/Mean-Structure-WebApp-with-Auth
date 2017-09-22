var mongoose = require('mongoose');

// Define our client schema
var Schema = new mongoose.Schema({
  _id: { type: String, unique: true, required: true },
  expire_time: { type: Date, required: true },
  token: { type: String, required: true },
}, { collection: 'oauth2_refresh_token', _id: false});

// Export the Mongoose model
module.exports = mongoose.model('OAuth2RefreshToken', Schema);