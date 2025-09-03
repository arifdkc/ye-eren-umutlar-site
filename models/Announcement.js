const mongoose = require("mongoose");

// Görselsiz duyuru
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  part: { type: String, enum: ["general", "className"], default: "general" },
  createdAt: { type: Date, default: Date.now }
});

const Announcement = mongoose.model("Announcement", announcementSchema);

// Görselli duyuru
const announcementSchemaIMG = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  part: { type: String, enum: ["general", "className"], default: "general" },

  createdAt: { type: Date, default: Date.now }
});     

const AnnouncementIMG = mongoose.model("AnnouncementIMG", announcementSchemaIMG);


module.exports = { Announcement, AnnouncementIMG };
