const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users');
const Status = require('./status')

const enrolledSchema = new Schema({
    user_id:User._id,
    SRN:String,
    status_id:Status._id,
    program:String,
    doj: Date
});

const Enrolled = mongoose.model('enrolled', enrolledSchema);