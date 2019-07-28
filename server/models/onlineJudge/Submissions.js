const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  output: {
    type: Schema.Types.ObjectId,
    ref: 'Outputs'
  },
  problem: {
    type: Schema.Types.ObjectId,
    ref: 'Problems'
  },
  sourceCode: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Submissions', SubmissionSchema);
