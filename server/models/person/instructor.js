const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./users');

const instructorSchema = new Schema({
    user_id: User._id
});

const Instructor = mongoose.model('instructor', instructorSchema);
module.exports = Instructor;