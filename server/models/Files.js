const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    originalname: {
        type: String,
        required: true
    },
    encoding: {
        type:String,
        required: true
    },
    mimetype:{
        type:String,
        required:true
    },
    destination: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    }, 
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required:true
    }
}, {strict:false});

module.exports = mongoose.model('File', FileSchema);
