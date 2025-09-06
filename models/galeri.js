const { text } = require("express");
const mongoose = require("mongoose");

// Resimler için ayrı bir şema
const imageSchema = new mongoose.Schema({
  filename: String,
  path: String
});

// Gönderi (Post) için ana şema
const postSchema = new mongoose.Schema({
  text: String,
  images: [imageSchema], // images dizisi, imageSchema tipinde nesneler içerecek
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);