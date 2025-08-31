// routes/lectureRoutes.js
const express = require("express");
const router = express.Router();
const Lecture = require("../models/Lecture");

// =========================
// GET all lectures
// =========================
router.get("/", async (req, res) => {
  try {
    const lectures = await Lecture.find().populate("students"); // ✅ show student details too
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch lectures", error: err.message });
  }
});

// =========================
// CREATE new lecture
// =========================
router.post("/", async (req, res) => {
  try {
    const { title, lecturer, date, time, venue, reminderTime } = req.body;

    const newLecture = new Lecture({
      title,
      lecturer,
      date,
      time,
      venue,
      reminderTime
    });

    const savedLecture = await newLecture.save();
    res.status(201).json(savedLecture);
  } catch (err) {
    res.status(400).json({ message: "Failed to create lecture", error: err.message });
  }
});

// =========================
// UPDATE a lecture
// =========================
router.put("/:id", async (req, res) => {
  try {
    const updatedLecture = await Lecture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // ✅ returns updated doc
    );

    if (!updatedLecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.json(updatedLecture);
  } catch (err) {
    res.status(400).json({ message: "Failed to update lecture", error: err.message });
  }
});

// =========================
// DELETE a lecture
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const deletedLecture = await Lecture.findByIdAndDelete(req.params.id);

    if (!deletedLecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.json({ message: "Lecture deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete lecture", error: err.message });
  }
});

module.exports = router;
