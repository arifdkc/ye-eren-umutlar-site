// models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // kim gönderdi
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // kime gitti
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
  className: { type: String, required: true }
});

module.exports = mongoose.model("Message", MessageSchema);
