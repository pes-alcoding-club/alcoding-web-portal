const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new mongoose.Schema({
    students:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    name:{
        type: String,
        required: true
    },
    graduating:{
        type: String,
        required: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Group', GroupSchema);
