const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const lectureRoutes = require("./routes/lectureRoutes");
const studentRoutes = require("./routes/studentRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

const sendEmail = require("./utils/mailer");
const startReminderScheduler = require("./scheduler/reminderScheduler");

const app = express();

// =========================
// Middleware
// =========================
app.use(express.json());
app.use(cors());

console.log("📡 Starting server...");

// =========================
// MongoDB Connection
// =========================
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lecture_reminder";

// Start server immediately
const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Connect to MongoDB in background
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    // Start reminder scheduler only after DB connects
    startReminderScheduler();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

// =========================
// Routes
// =========================
app.use("/api/lectures", lectureRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/reminders", reminderRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Lecture Reminder API is running ✅");
});

// ✅ Simple route to test mailer
app.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "paulolacasto02@gmail.com",
      "Test Reminder",
      "This is a test reminder email."
    );
    res.send("✅ Test email sent!");
  } catch (err) {
    console.error("❌ Test email failed:", err.message);
    res.status(500).send("Failed to send test email");
  }
});
