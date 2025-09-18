const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  public_id: String, // Cloudinary dosya ID'si
  url: String        // Cloudinary URL'si
});

const postSchema = new mongoose.Schema({
  text: String,
  images: [imageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  className: String
});

module.exports = mongoose.model("Post", postSchema);
