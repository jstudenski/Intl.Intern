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
  expAmountLocalCurrency: {
    type: Number,
    required: true
  },
  expDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId, ref: 'user'
  }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
