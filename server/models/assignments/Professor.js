const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ProfessorSchema = new mongoose.Schema({
  user: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

});

module.exports = mongoose.model('Professor', ProfessorSchema);
