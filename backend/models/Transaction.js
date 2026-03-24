const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  category: String,
  description: String,
  date: Date,
  icon: String,        // Added to support the frontend's icon display
  fromSms: Boolean     // Added to support the SMS tracker tag
});

module.exports = mongoose.model("Transaction", transactionSchema);
