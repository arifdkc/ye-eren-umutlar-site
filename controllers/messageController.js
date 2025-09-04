// controllers/messageController.js
const User = require("../models/User");
const Message = require("../models/Message");

exports.getMessagePage = async (req, res) => {
  try {
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

    res.render("messages", { students, messages, loggedInUser });
    
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.getMessage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("Kullanıcı bulunamadı");

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    }).populate("sender receiver", "name");

    res.render("userMessages", { user, messages });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
const user = await User.findById(req.user._id);

    await Message.create({
      sender: req.user._id,
      name: req.user.name,
      receiver: receiverId,
      text,
      className: req.user.className
      
         
     
    });

    res.redirect("/messages");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const loggedInUser = req.user;

    // Mesajı çek
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).send("Mesaj bulunamadı");

    // Yetki kontrolü
    if (
      loggedInUser.role !== "moderator" && // moderator değilse
      message.sender.toString() !== loggedInUser._id // kendi mesajı değilse
    ) {
      return res.status(403).send("Mesajı silmeye yetkiniz yok");
    }

    // Silme işlemi
    await Message.findByIdAndDelete(messageId);
    res.redirect("/messages");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const Image = require("../models/galeri");

// Çoklu resim yükleme
exports.uploadImages = async (req, res) => {
  try {
    const files = req.files;

    const images = await Promise.all(
      files.map(async (file) => {
        const newImage = new Image({
          filename: file.filename,
          path: file.path,
        });
        await newImage.save();
        return newImage;
      })
    );
  res.redirect("/moderator");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Resim yüklenirken hata oluştu" });
  }
};

// Tüm resimleri listeleme
exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: "Resimler alınırken hata oluştu" });
  }
};

