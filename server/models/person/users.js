const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const userSchema = new Schema({
    name:String,
    email:String,
    phone:Number,
    dob:Date,
    password: String
})

//Create Model
const User = mongoose.model('users', userSchema);
module.exports = User;