const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Course_offered = require('../course-related/course_offered');
const Type = require('./type');
const Instructor = require('../models/instructor');

const assignmentSchema = new Schema({
    course_offered_id: Course_offered._id,
    type_id: Type._id,
    max_marks: Number,
    main_instructor_id: Instructor._id,
    resource_url: String,
    due_date: Date
});

const Assignment = mongoose.model('assignment', assignmentSchema);
module.exports = Assignment;