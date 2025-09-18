const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const Post = require("../models/galeri");

// Fotoğraf yükleme
router.post("/upload", upload.array("images"), async (req, res) => {
  try {
    const files = req.files.map(file => ({
      url: file.path,         // Cloudinary url
      public_id: file.filename, // Cloudinary id
    }));

    const newPost = new Post({
      text: req.body.text,
      images: files,
    });

    await newPost.save();
    res.redirect('/users');

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Yükleme hatası" });
  }
});

// Tüm postları getir
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

module.exports = router;
