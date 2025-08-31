// routes/reminderRoutes.js
const express = require("express");
const Reminder = require("../models/Reminder");

const router = express.Router();

/**
 * =========================
 * CREATE a new reminder
 * =========================
 */
router.post("/", async (req, res) => {
  try {
    const { lecture, students, message, reminderTime } = req.body;

    if (!lecture || !message || !reminderTime) {
      return res.status(400).json({ error: "lecture, message, and reminderTime are required" });
    }

    const reminder = new Reminder({
      lecture,
      students: students || [],
      message,
      reminderTime,
      sent: false, // default
    });

    const savedReminder = await reminder.save();
    res.status(201).json(savedReminder);
  } catch (err) {
    console.error("Error creating reminder:", err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * =========================
 * GET all reminders
 * =========================
 */
router.get("/", async (req, res) => {
  try {
    const reminders = await Reminder.find()
      .populate("lecture", "title lecturer date time venue")
      .populate("students", "name email phone department");

    res.json(reminders);
  } catch (err) {
    console.error("Error fetching reminders:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================
 * UPDATE a reminder (mark as sent, or edit details)
 * =========================
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("lecture", "title lecturer date time venue");

    if (!updatedReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.json(updatedReminder);
  } catch (err) {
    console.error("Error updating reminder:", err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * =========================
 * DELETE a reminder
 * =========================
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedReminder = await Reminder.findByIdAndDelete(req.params.id);

    if (!deletedReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.json({ message: "Reminder deleted successfully" });
  } catch (err) {
    console.error("Error deleting reminder:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
