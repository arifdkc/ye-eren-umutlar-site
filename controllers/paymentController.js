const Payment = require("../models/payment");
 
exports.getPayments = async (req, res) => {
  try {
    const userId = req.user._id; // JWT veya session’dan
    const payments = await Payment.find({ studentId: userId }).sort({ dueDate: 1 });
    
    res.render("payments", { payments });
  } catch (error) {
    console.error(error);
    res.status(500).send("Ödeme bilgileri alınamadı");
  }
};
// controllers/paymentController.js

const User = require("../models/User");
 
exports.getUserPayments = async (req, res) => {
 try {
    const studentId = req.params.studentId;

    // Öğrenciyi DB'den çek
    const student = await User.findById(studentId);
    if (!student) return res.status(404).send("Öğrenci bulunamadı");

    // Kullanıcı sadece kendi ödemesini görebilsin
   

    // Öğrencinin ödemelerini DB'den çek
    const payments = await Payment.find({ studentId: studentId }).sort({ month: 1 });

    console.log("payments:", payments, studentId); // ← Bu satırda gerçekten ödeme var mı kontrol et

    // EJS'e verileri gönder
    res.render("studentPayments", {
      student: student,
      payments: payments,
      user: req.user // rol kontrolü için
    });
  } catch (err) {
    console.error("Öğrenci ödeme verileri alınırken hata:", err);
    res.status(500).send("Bir hata oluştu");
  }
};