const { Announcement, AnnouncementIMG } = require("../models/Announcement");
const User = require('../models/User');
const Message = require("../models/Message");
const Post = require("../models/galeri");
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

    } else if (loggedInUser.role === "admin") {
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

    res.render("moderator", { user, announcements, announcementsIMG, classes, students, messages, loggedInUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Bir hata oluştu.");
  }
};

exports.addImage = async (req, res) => {
 try {
    const { text, className } = req.body;

    // Görselleri Cloudinary'e yükle
    let images = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "class-posts"
        });
        images.push({ public_id: result.public_id, url: result.secure_url });
      }
    }

    const post = new Post({
      text,
      images,
      className
    });

    await post.save();
    res.redirect("/moderator");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Post oluşturulamadı" });
  }
};


// Post silme
const cloudinary = require("../config/cloudinary");

exports.deleteImage = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post bulunamadı");

    // Cloudinary’den görselleri sil
    for (let img of post.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // MongoDB’den post’u sil
    await Post.findByIdAndDelete(req.params.id);

    res.redirect("/users");
  } catch (err) {
    console.error("Silme hatası:", err);
    res.status(500).send("Sunucu hatası");
  }
};;
