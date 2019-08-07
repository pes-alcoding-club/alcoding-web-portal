const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CourseSchema = new mongoose.Schema({
  class: {
    teachingMembers:[{
      teacher : {
        type: Schema.Types.ObjectId,
        required: true,
      },
      role : {
        type: String,
        required: true
      }
    }],
    sections: [{
      type: String
    }]
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  description: {
    type: String, 
  },
  duration: {
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  assignments: [{
    type: Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  details: {
    credits: {
      type: Number,
    },
    hours: {
      type: Number,
    },
    isCore: {
      type: Boolean,
      default: true
    },
  },
  validated: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Course', CourseSchema);