const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new mongoose.Schema({
    members:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    name:{
        type: String,
        required: true
    },
    termEndYear:{
        type: Number
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Group', GroupSchema);
