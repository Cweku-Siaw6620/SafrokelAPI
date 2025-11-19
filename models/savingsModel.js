const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Savings = mongoose.model('Savings', savingsSchema);

module.exports = Savings;