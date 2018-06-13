const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users');

const staffSchema = new Schema({
    doj:Date,
    room_number:String,
    designation:String,
    user_id:User.ObjectId
});

const Staff = mongoose.model('staff', staffSchema);