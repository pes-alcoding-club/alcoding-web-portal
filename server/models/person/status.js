const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusSchema = new Schema({
    name: String
});

const Status = mongoose.model('status', statusSchema);
module.exports = Status;