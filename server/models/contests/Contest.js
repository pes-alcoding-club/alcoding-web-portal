const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
  },
  ranksUrl: {
    type: String,
    required: true,
  },
  maxScore: {
    type: Number,
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

module.exports = mongoose.model('Contest', ContestSchema);
