
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "moderator"],
    default: "user"
  },
  announcements: {
    type: [String],
    default: []
  },
  profileImage: { type: String },
  className: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);