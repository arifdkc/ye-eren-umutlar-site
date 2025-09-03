const multer = require("multer");
const path = require("path");

// Dosyanın nereye kaydedileceğini ayarlıyoruz
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // public/uploads klasörüne kaydet
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Benzersiz isim
  },
});

// Sadece PDF dosyalarına izin verelim
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Sadece PDF dosyalarına izin verilir"));
  }
};

// Multer ayarları
const upload = multer({ storage, fileFilter });

module.exports = upload;
