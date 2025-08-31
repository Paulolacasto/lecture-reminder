const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture", required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }],
  message: { type: String, required: true },
  reminderTime: { type: Date, required: true },
  sent: { type: Boolean, default: false },
});

// ✅ Export the model properly
const Reminder = mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;
