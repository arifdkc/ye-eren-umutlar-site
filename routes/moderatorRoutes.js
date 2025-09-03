const express = require("express");
const router = express.Router();

const { authCookieMiddleware,moderatorMiddleware } = require("../middleware/authMiddleware"); // dikkat: "middlewares"
const { getModeratorPanel, addImage } = require("../controllers/moderatorController");

// Moderator panelini görme
router.get("/", authCookieMiddleware, moderatorMiddleware, getModeratorPanel);

// Görsel ekleme
router.post("/add-image", authCookieMiddleware, moderatorMiddleware, addImage);

module.exports = router;
