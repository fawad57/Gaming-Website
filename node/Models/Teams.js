const mongoose = require("mongoose");

const TeamsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  head_name: {
    type: String,
  },
  vice_head: { type: String },
  no_of_members: { type: Number, default: 0 },
});

const TeamsModel = mongoose.model("Teams", TeamsSchema);
module.exports = TeamsModel;
