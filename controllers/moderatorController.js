const { Announcement, AnnouncementIMG } = require("../models/Announcement");
const User = require('../models/User');
const Message = require("../models/Message");

exports.getModeratorPanel = async (req, res) => {
  try {
    // req.user token'dan geliyor (JWT)
    // Eğer token'da className yoksa DB'den çek
    
        const loggedInUser = req.user;
    
        let students = [];
        let messages = [];
        
        // Yalnızca moderatörler kendi sınıfının mesajlarını ve kullanıcılarını görebilir.
        if (loggedInUser.role === "moderator") {
          // 1. Sınıftaki tüm velileri (alıcılar) bul.
          const classStudents = await User.find({ role: "user", className: loggedInUser.className });
          students = classStudents; // Formda listelemek için.
    
          // 2. Moderatörün kendisi ve sınıfındaki velilerin ID'lerini bir diziye topla.
          const classMemberIds = classStudents.map(s => s._id);
          classMemberIds.push(loggedInUser._id);
    
          // 3. Mesajları çekerken, gönderen veya alıcının bu sınıftaki üyelerden biri olmasını şart koş.
      messages = await Message.find({
      sender: { $in: classMemberIds },
      receiver: { $in: classMemberIds }
    }).populate("sender receiver", "name");
    
        }else if (loggedInUser.role === "admin") {
          // Admin tüm mesajları görebilir.
          messages = await Message.find().populate("sender receiver", "name");
        }
    
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

    res.render("moderator", { user, announcements, announcementsIMG , classes,students, messages, loggedInUser});
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

