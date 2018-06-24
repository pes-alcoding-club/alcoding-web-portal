const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  isLoggedOut: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('UserSession', UserSessionSchema);