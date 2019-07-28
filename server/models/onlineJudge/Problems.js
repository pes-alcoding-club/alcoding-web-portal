const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  definition: {
    type: String,
    required: true
  },
  inputFormat: {
    type: String,
    required: true
  },
  outputFormat: {
    type: String,
    required: true
  },
  constraints: {
    type: String,
    required: true
  },
  languages: [{
    type: String,
    required: true
  }],
  testCases: [{
    name: {
      type: String,
      required: true
    },
    input: {
      type: Schema.Types.ObjectId,
      ref: 'Files',
      required: true
    },
    output: {
        type: Schema.Types.ObjectId,
        ref: 'Files',
        required: true
    },
    sample: {
      type: Boolean,
      required: true,
      default: false
    },
    points: {
        type: Number,
        required: true
    },
    time: {
      type: Number,
      required: true
    }
  }],
  sampleExplaination: {
    type: String,
  },
  editorial: {
    type: String,
  },
  hasCustomChecker: {
    type: Boolean,
    default: false
  },
  customChecker: {
    type: Schema.Types.ObjectId,
    ref: 'Files'
  },
  problemSetterSolution: {
    type: Schema.Types.ObjectId,
    ref: 'Files'
  },
  difficulty: {
    type: Number,
  },
  tags: [{
    type: String,
  }],
  timestamp: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Problems', ProblemSchema);
