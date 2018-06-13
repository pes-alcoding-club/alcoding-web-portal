const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Course_offered = require('./course_offered');
const Student = require('../models/student');

const students_in_courseSchema = new Schema({
    course_offered_id: Course_offered._id,
    student_id: Student._id,
    hours_attended: Number
});

const Students_in_course = mongoose.model('Students_in_course', students_in_courseSchema);
module.exports = Students_in_course;