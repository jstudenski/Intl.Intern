const mongoose = require('mongoose');

const { Schema } = mongoose;

const needsSchema = new Schema({
  needNumber: {
    type: Number,
    required: true
  },
  needTitle: {
    type: String,
    required: true
  },
  needDesc: {
    type: String,
    required: true
  },
  needDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId, ref: 'user'
  }
});

const Needs = mongoose.model('Needs', needsSchema);

module.exports = Needs;
