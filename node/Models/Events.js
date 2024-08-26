const mongoose = require("mongoose");

const EventsSchema = new mongoose.Schema({
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
});

const EventsModel = mongoose.model("Events", EventsSchema);
module.exports = EventsModel;
