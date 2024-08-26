const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: String,
  password: String,
  phone: String,
  role: {
    type: String,
    default: "user",
  },
});

const MemberModel = mongoose.model("Members", MemberSchema);
module.exports = MemberModel;
