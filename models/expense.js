const mongoose = require('mongoose');

const { Schema } = mongoose;

const expenseSchema = new Schema({
  expDesc: {
    type: String,
    required: true
  },
  expAmount: {
    type: Number,
    required: true
  },
  expDate: {
    type: Date,
    default: Date.now
  }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
