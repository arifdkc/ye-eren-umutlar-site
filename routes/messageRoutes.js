// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const { getMessage, getMessagePage, sendMessage, deleteMessage, uploadImages } = require("../controllers/messageController");
const { authCookieMiddleware, moderatorMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
router.get("/", authCookieMiddleware, moderatorMiddleware, getMessagePage);
router.get("/:userId", authCookieMiddleware, getMessage);
router.post("/", authCookieMiddleware, moderatorMiddleware, sendMessage);
router.post("/:messageId/delete", authCookieMiddleware, moderatorMiddleware, deleteMessage);
router.post(
    "/upload",
    upload.array("images", 10), // aynı anda max 5 resim
    uploadImages
);

// Resimleri listeleme

module.exports = router;
