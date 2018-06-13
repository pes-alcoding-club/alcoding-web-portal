const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const termSchema = new Schema({
    start_date: Date,
    end_date: Date,
    title: String
});

const Term = mongoose.model('term', termSchema);
module.exports = Term;