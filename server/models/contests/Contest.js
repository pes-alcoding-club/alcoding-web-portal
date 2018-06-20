const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  contenders: {
    type: [Schema.Types.ObjectId],
    ref: 'Contender'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', UserSchema);
