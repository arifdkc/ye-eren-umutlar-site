const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true }, // Örn: "Ağustos 2025"
  amount: { type: Number, required: true },
  status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  dueDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
