const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Mutlaka parantezsiz geç
router.get("/", authMiddleware, userController.getUserPanel);

module.exports = router;
