const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Department= require('../models/department');

const courseSchema = new Schema({
    course_code: String,
    title: String,
    semester: String,
    credits: String,
    hours_required: Number,
    core_elective: String,
    department_id: Department._id
});

const Course = mongoose.model('course', courseSchema);
module.exports = Course;