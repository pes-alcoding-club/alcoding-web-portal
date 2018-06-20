const mongoose = require('mongoose');

const ContenderSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  handle: [{
    type: Map,
    of: String
  }],
  history: [{
    contest: {
      type: String,
    },
    rank: {
      type: Number,
    }
  }],
  currentRank: {
    type: Number,
    required: true,
    default: -1
  },
  pastRanks: {
    type: [Number],
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Contender', ContenderSchema);
