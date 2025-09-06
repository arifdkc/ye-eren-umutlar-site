const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { authCookieMiddleware,moderatorMiddleware } = require("../middleware/authMiddleware"); // dikkat: "middlewares"
const { getModeratorPanel, addImage, deleteImage } = require("../controllers/moderatorController");

// Moderator panelini görme
router.get("/", authCookieMiddleware, moderatorMiddleware, getModeratorPanel);

// Görsel ekleme
router.post("/add-image", upload.array("images", 10), authCookieMiddleware, moderatorMiddleware, addImage);

// Görsel silme
router.post("/delete-post/:id", authCookieMiddleware, moderatorMiddleware, deleteImage);

module.exports = router;
