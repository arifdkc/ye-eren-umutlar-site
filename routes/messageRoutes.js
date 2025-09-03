// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const {getMessage, getMessagePage, sendMessage ,deleteMessage} = require("../controllers/messageController");
const { authCookieMiddleware, moderatorMiddleware} = require("../middleware/authMiddleware");
    
router.get("/",authCookieMiddleware,moderatorMiddleware, getMessagePage);
router.get("/:userId", authCookieMiddleware, getMessage);
router.post("/",authCookieMiddleware,moderatorMiddleware, sendMessage);
router.post("/:messageId/delete", authCookieMiddleware, moderatorMiddleware, deleteMessage);
module.exports = router;
