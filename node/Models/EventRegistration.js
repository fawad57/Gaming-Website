const mongoose = require("mongoose");

const EventRegistrationSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
  },
  member_email: {
    type: String,
    required: true,
  },
});

const EventRegistrationModel = mongoose.model(
  "Events_Registration",
  EventRegistrationSchema
);
module.exports = EventRegistrationModel;
