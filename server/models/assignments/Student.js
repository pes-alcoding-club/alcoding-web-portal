const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const StudentSchema = new mongoose.Schema({
  user: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  
});

module.exports = mongoose.model('Student', StudentSchema);
