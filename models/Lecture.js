const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lecturer: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g., "10:30"
  venue: { type: String, required: true },
  reminderTime: { type: Number, default: 30 }, // minutes before
  reminderSent: { type: Boolean, default: false },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    }
  ]
});

module.exports = mongoose.model("Lecture", lectureSchema);
