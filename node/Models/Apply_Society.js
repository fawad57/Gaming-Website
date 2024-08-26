const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  date: { type: Date, default: Date.now },
  approve_by: {
    type: String,
    default: "none",
  },
});

const ApplicationModel = mongoose.model("Applications", ApplicationSchema);
module.exports = ApplicationModel;
