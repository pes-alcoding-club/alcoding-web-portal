const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Assignment = require('./assignment')
const Students_in_course = require('../course-related/students_in_course')

const assignment_submissionSchema = new Schema({
    assignment_id:Assignment._id,
    students_in_course_id:Students_in_course._id,
    url: String,
    marks_obtained: Number
});

const Assignment_submission = mongoose.model('assignment_submission', assignment_submissionSchema);
module.exports = Assignment_submission;