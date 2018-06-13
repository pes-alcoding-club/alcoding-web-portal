const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./users');

const studentSchema = new Schema({
    user_id: User._id
});

const Student = mongoose.model('student', studentSchema);
module.exports = Student;