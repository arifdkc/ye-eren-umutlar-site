const multer = require("multer");
const path = require("path");

// Depolama ayarı
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // resimler uploads klasörüne kaydolacak
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

// Dosya tipi kontrolü
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Sadece resim dosyası yükleyebilirsiniz!"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
