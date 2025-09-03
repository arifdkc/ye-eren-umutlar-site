const { Announcement, AnnouncementIMG } = require("../models/Announcement");
const WeeklyFiles = require("../models/WeeklyFiles");
const User = require("../models/User");

exports.getUserPanel = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    const announcementsIMG = await AnnouncementIMG.find().sort({ createdAt: -1 });
    const weeklyFiles = await WeeklyFiles.findOne().sort({ uploadedAt: -1 });
   res.render("user", {
      user: req.user,
      announcements,
      announcementsIMG,
      weeklyFiles,
     

    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};  