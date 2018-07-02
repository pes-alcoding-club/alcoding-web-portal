const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ContestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  platform: {
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
  date: {
    type: Date,
    required: true
  },
  maxScore: {
    type: Number,
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
