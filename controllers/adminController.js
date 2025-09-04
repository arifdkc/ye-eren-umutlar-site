const User = require('../models/User');
const Message = require("../models/Message");
const Payment = require("../models/payment");
const { Announcement, AnnouncementIMG } = require("../models/Announcement");



const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {

  try {
    const { name, email, password, role, className } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      className,
      profileImage: req.file ? req.file.filename : null, // ← BURASI ÖNEMLİ
    });

    await newUser.save();
    res.redirect("/admin");
  } catch (error) {
    console.error("Kullanıcı eklenirken hata:", error);
    res.status(500).send("Kullanıcı eklenemedi");
  }
};

exports.getMainPage = async (req, res) => {
 try {
    // req.user token'dan geliyor (JWT)
    // Eğer token'da className yoksa DB'den çek
    let user = req.user;
 const classes = await User.distinct("className");
    if (!user.className) {
      const dbUser = await User.findById(user.id);
      if (!dbUser) return res.status(404).send("Kullanıcı bulunamadı");
      user = {
        ...user,
        className: dbUser.className,
        role: dbUser.role,
        classes: classes
      };
    }

    // Görselsiz duyurular: genele veya kendi sınıfına ait
    const announcements = await Announcement.find({
      $or: [
        { part: "general" },
        { part: user.className }
      ]
    }).sort({ createdAt: -1 });

    // Görselli duyurular: genele veya kendi sınıfına ait
    const announcementsIMG = await AnnouncementIMG.find({
      $or: [
        { part: "general" },
        { part: user.className }
      ]
    }).sort({ createdAt: -1 });

    res.render("main", { user, announcements, announcementsIMG , classes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Bir hata oluştu.");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.redirect("/admin");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
// Yeni ödeme ekle
// Yeni ödeme ekle
// Yeni ödeme ekle
exports.addPayment = async (req, res) => {
  try {
    const { studentId, month, amount, status, dueDate } = req.body;

    // ödeme eklenecek kullanıcıyı bul
    const targetUser = await User.findById(studentId);
    if (!targetUser) {
      return res.status(404).send("Öğrenci bulunamadı!");
    }

    // Eğer kullanıcı moderator ise ödeme planı eklenmesin
    if (targetUser.role === "moderator") {
      return res.status(400).send("Moderatora ödeme planı eklenemez!");
    }

    // aynı ay için ödeme varsa güncelle
    const existingPayment = await Payment.findOne({ studentId, month });
    if (existingPayment) {
      existingPayment.amount = amount;
      existingPayment.status = status;
      existingPayment.dueDate = dueDate || existingPayment.dueDate;
      await existingPayment.save();
    } else {
      const payment = new Payment({
        studentId,
        month,
        amount,
        status,
        dueDate: dueDate || new Date(month + "-28") // boşsa ay sonu default
      });
      await payment.save();
    }
    res.redirect("/admin");
  } catch (err) {
    console.error("Ödeme eklenirken hata:", err);
    res.status(500).send("Ödeme eklenirken hata oluştu");
  }
};


exports.getAdminPanel = async (req, res) => {
  try {
    
    const user = await User.find();
    const payments = await Payment.find().populate("studentId", "name className").sort({ dueDate: 1 });
    const classes = await User.distinct("className");
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    const announcementsIMG = await AnnouncementIMG.find().sort({ createdAt: -1 });
 // Her öğrenci için son ödemeyi al
    const paymentsWithLastMonth = await Promise.all(
      user.map(async (student) => {
        const lastPayment = await Payment.find({ studentId: student._id })
          .sort({ dueDate: -1 }) // son ödeme
          .limit(1);
        return {
          student,
          lastPayment: lastPayment[0] || null,
        };
      })
    );

    res.render("admin", { user, classes, announcements, announcementsIMG , payments, paymentsWithLastMonth  });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.addImage = async (req, res) => {
  try {
    const { userId, image } = req.body;
    await User.findByIdAndUpdate(userId, { $push: { images: image } });
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Tüm ödemeleri listele (admin panel)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("studentId", "name className").sort({ dueDate: 1 });
    res.render("adminPayments", { payments });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ödemeler alınamadı");
  }
};

// Admin paneli: öğrenciler ve son ay ödemeleri
exports.getStudentPayments = async (req, res) => {
  try {
    // Tüm öğrenciler
    const students = await User.find({ role: "user" });

    // Her öğrenci için son ödemeyi al
    const paymentsWithLastMonth = await Promise.all(
      students.map(async (student) => {
        const lastPayment = await Payment.find({ studentId: student._id })
          .sort({ dueDate: -1 }) // son ödeme
          .limit(1);
        return {
          student,
          lastPayment: lastPayment[0] || null,
        };
      })
    );

    res.redirect("/admin", { paymentsWithLastMonth });
  } catch (err) {
    console.error(err);
    res.status(500).send("Öğrenci ödemeleri alınamadı");
  }
};
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const WeeklyFiles = require("../models/WeeklyFiles");
const e = require('express');

exports.uploadWeeklyFiles = async (req, res) => {
  try {
    const scheduleFile = req.files['schedulePdf'] ? req.files['schedulePdf'][0].filename : null;
    const menuFile = req.files['menuPdf'] ? req.files['menuPdf'][0].filename : null;

    if (!scheduleFile && !menuFile) {
      return res.status(400).send("Dosya yüklenmedi");
    }

    // DB kaydı
    await WeeklyFiles.create({
      schedulePdf: scheduleFile,
      menuPdf: menuFile
    });

    res.redirect("/admin"); // Admin paneline dön
  } catch (err) {
    console.error(err);
    res.status(500).send("Dosya yüklenirken hata oluştu");
  }
};


exports.updatePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const { amount, status } = req.body;

    await Payment.findByIdAndUpdate(paymentId, {
      amount,
      status,
    });

    res.redirect("/admin"); // Ödeme güncelleme sonrası admin paneline yönlendir
  } catch (err) {
    console.error(err);
    res.status(500).send("Ödeme güncellenemedi");
  }
};
// controllers/adminController.js
exports.getStudentPaymentById = async (req, res) => {
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
exports.getAdminMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate("sender receiver", "name");
    res.render("adminMessage", { messages });
  } catch (err) {
    console.error(err);
    res.status(500).send("Mesajlar alınamadı");
  }
};