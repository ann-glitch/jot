const mongoose = require("mongoose");

const IdeasSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    ref: "Users",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ideas", IdeasSchema);
