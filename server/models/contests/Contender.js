const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ContenderSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  handles: [{
    platform: {
      type: String
    },
    handle: {
      type: String
    }
  }],
  history: [{
    contest: {
      type: Schema.Types.ObjectId,
      ref: 'Contest'
    },
    score: {
      type: Number,
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
