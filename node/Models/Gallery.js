const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "Image",
  },
});

const GalleryModel = mongoose.model("Gallery", GallerySchema);
module.exports = GalleryModel;
