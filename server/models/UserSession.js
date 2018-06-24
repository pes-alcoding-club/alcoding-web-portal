const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('UserSession', UserSessionSchema);