// routes/announcementRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { createAnnouncement, deleteAnnouncement } = require("../controllers/announcementController");
const {addAnnouncementMiddleware, authCookieMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
    
// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Resimler uploads klasörüne kaydedilecek
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // benzersiz isim
  },
});

const upload = multer({ storage });

// Rotalar
// /announcementRoutes POST isteği ile yeni duyuru ve görsel eklenir
router.post("/", upload.single("image"), createAnnouncement);
// Duyuru sil (admin)
router.post("/:id", authCookieMiddleware, addAnnouncementMiddleware, deleteAnnouncement);

module.exports = router;

