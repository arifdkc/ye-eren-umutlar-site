const express = require("express");
const router = express.Router();
const { getPayments,getUserPayments } = require("../controllers/paymentController");
const { authCookieMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const { getStudentPaymentById } = require("../controllers/adminController");


// Belirli öğrencinin ödeme planını göster
router.get("/:studentId", authCookieMiddleware,  getUserPayments);

module.exports = router;
