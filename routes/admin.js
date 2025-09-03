// routes/admin.js
const express = require("express");
const router = express.Router();
const {getMainPage,createUser,deleteUser,getAdminMessages, uploadWeeklyFiles,getAllPayments, updatePayment,addAnnouncement, getAdminPanel,getStudentPayments,addPayment,getStudentPaymentById }  = require("../controllers/adminController");
const { authCookieMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const uploadPDF = require("../middleware/uploadPDF");
const upload = require("../middleware/upload");
// Tüm ödemeleri listele
router.get("/payments", adminMiddleware, getAllPayments);
router.post("/student-payments/add", authCookieMiddleware, adminMiddleware, addPayment);

router.post(
  "/upload-weekly",
  authCookieMiddleware,
  adminMiddleware,
  uploadPDF.fields([
    { name: "schedulePdf", maxCount: 1 },
    { name: "menuPdf", maxCount: 1 }
  ]),
  uploadWeeklyFiles
);

// Ödeme güncelle
router.post("/payments/:id/update", adminMiddleware, updatePayment);

router.get("/", authCookieMiddleware, adminMiddleware, getAdminPanel);
router.post("/add-announcement", authCookieMiddleware, adminMiddleware,upload.single("profileImage"), createUser);


router.get("/admin-messages", authCookieMiddleware, adminMiddleware, getAdminMessages);
router.get("/student-payments", authCookieMiddleware, adminMiddleware, getStudentPayments);
router.post("/student-payments/:id/update", authCookieMiddleware, adminMiddleware, updatePayment);
router.get("/adminPayments/:studentId", authCookieMiddleware, adminMiddleware, getStudentPaymentById);
router.post("/delete-user/:userId", authCookieMiddleware, adminMiddleware, deleteUser);
router.get("/delete-user/:userId", authCookieMiddleware, deleteUser);
router.get("/main", authCookieMiddleware, getMainPage);

module.exports = router;
 