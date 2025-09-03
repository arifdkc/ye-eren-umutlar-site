const { Announcement, AnnouncementIMG } = require("../models/Announcement");
const User = require('../models/User');

exports.getModeratorPanel = async (req, res) => {
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

    res.render("moderator", { user, announcements, announcementsIMG , classes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Bir hata oluştu.");
  }
};


exports.addImage = async (req, res) => {
  try {
    const { userId, image } = req.body;
    await User.findByIdAndUpdate(userId, { $push: { images: image } });
    res.redirect("/moderator");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

