const mongoose = require("mongoose");

const RequestedEventsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  posted_by: {
    type: String,
    // required: true,
    default: "Fawad",
  },
  picture: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  approve_by: {
    type: String,
    default: "none",
  },
});

const RequestedEventsModel = mongoose.model(
  "Requested_Events",
  RequestedEventsSchema
);
module.exports = RequestedEventsModel;
