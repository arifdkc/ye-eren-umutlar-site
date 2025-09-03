// models/WeeklyFiles.js
const mongoose = require("mongoose");

const weeklyFilesSchema = new mongoose.Schema({
  schedulePdf: { type: String },
  menuPdf: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WeeklyFiles", weeklyFilesSchema);
