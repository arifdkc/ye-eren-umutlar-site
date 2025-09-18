const { Announcement, AnnouncementIMG } = require("../models/Announcement");
const WeeklyFiles = require("../models/WeeklyFiles");
const User = require("../models/User");
const Post = require("../models/galeri");
 
exports.getUserPanel = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    const announcementsIMG = await AnnouncementIMG.find().sort({ createdAt: -1 });
    const weeklyFiles = await WeeklyFiles.findOne().sort({ uploadedAt: -1 });
    const { className } = req.params;
    const posts = await Post.find({ className }).sort({ createdAt: -1 });
   res.render("user", {
      user: req.user,
      announcements,
      announcementsIMG,
      weeklyFiles,
     posts

    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Postlar getirilemedi" });
  }
};

