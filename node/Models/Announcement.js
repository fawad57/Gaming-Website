const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true, // Store the name or email of the head
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AnnouncementModel = mongoose.model("Announcement", AnnouncementSchema);

module.exports = AnnouncementModel;
