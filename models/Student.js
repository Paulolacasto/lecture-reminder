const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },          // Added
  department: { type: String, required: true }      // Added
});

module.exports = mongoose.model("Student", studentSchema);
