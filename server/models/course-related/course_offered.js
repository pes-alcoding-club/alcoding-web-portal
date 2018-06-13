const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Course = require('./course');
const Instructor = require('../models/instructor');
const Term = require('./term');

const course_offeredSchema = new Schema({
    course_id:Course._id,
    instructor_id:Instructor._id,
    term_id:Term._id,
    engaged_hours: Number
});

const Course_offered = mongoose.model('course_offered', course_offeredSchema);
module.exports = Course_offered;