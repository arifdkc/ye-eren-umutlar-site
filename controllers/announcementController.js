const { AnnouncementIMG } = require("../models/Announcement");

const createAnnouncement = async (req, res) => {
  try {
    const { title, description, part } = req.body;

    const newAnnouncement = new AnnouncementIMG({
      title,
      description,
      image: req.file ? req.file.filename : null, // multer sayesinde gelecek
      target: part,
    });

    await newAnnouncement.save();
    res.redirect("/user"); 
  } catch (error) {
    console.error("Duyuru eklenirken hata:", error);
    res.status(500).send("Duyuru eklenemedi");
  }
};


module.exports = { createAnnouncement };


// Silme işlemi
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params; // Silinecek duyuru ID'si

    // Duyuruyu bul ve sil
    const deleted = await AnnouncementIMG.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Duyuru bulunamadı" });
    }

    // Eğer duyurunun görseli varsa uploads klasöründen sil
    if (deleted.image) {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "../uploads", deleted.image);

      fs.unlink(filePath, (err) => {
        if (err) console.error("Dosya silme hatası:", err);
      });
    }

    res.json({ message: "Duyuru silindi", deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAnnouncement ,deleteAnnouncement};
