const cron = require("node-cron");
const Lecture = require("../models/Lecture");
const Student = require("../models/Student");
const Reminder = require("../models/Reminder");
const sendEmail = require("../utils/mailer");

function startReminderScheduler() {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    console.log("🔎 Checking for upcoming lectures and custom reminders...");

    /** -----------------------
     * 1. Handle lecture-based reminders
     * ---------------------- */
    const lectures = await Lecture.find();
    for (const lecture of lectures) {
      try {
        const lectureDateTime = new Date(lecture.date);

        // Merge date + time
        const [hours, minutes] = lecture.time.split(":");
        lectureDateTime.setHours(hours, minutes, 0, 0);

        // Calculate reminder time = lecture time - X minutes
        const reminderMoment = new Date(
          lectureDateTime.getTime() - lecture.reminderTime * 60000
        );

        // If within 1-minute window
        if (
          !lecture.reminderSent &&
          now >= reminderMoment &&
          now <= new Date(reminderMoment.getTime() + 60000)
        ) {
          console.log(`📩 Sending auto reminder for lecture: ${lecture.title}`);

          const students = await Student.find();

          // Create a Reminder record (auto type)
          const reminder = new Reminder({
            lecture: lecture._id,
            students: students.map((s) => s._id),
            message: `Reminder: ${lecture.title} by ${lecture.lecturer} at ${lecture.time}, ${lecture.venue}`,
            reminderTime: reminderMoment,
            sent: true, // already sent
          });
          await reminder.save();

          // Send emails
          for (const student of students) {
            await sendEmail(student.email, "Lecture Reminder", reminder.message);
          }

          // Mark lecture as reminder sent
          lecture.reminderSent = true;
          await lecture.save();
        }
      } catch (err) {
        console.error("❌ Error checking lecture:", err.message);
      }
    }

    /** -----------------------
     * 2. Handle custom reminders
     * ---------------------- */
    try {
      const reminders = await Reminder.find({
        sent: false,
        reminderTime: { $lte: now }
      }).populate("lecture students");

      for (const reminder of reminders) {
        console.log(`📩 Sending custom reminder for lecture: ${reminder.lecture.title}`);

        // Send to selected students
        for (const student of reminder.students) {
          await sendEmail(student.email, "Custom Reminder", reminder.message);
        }

        // Mark reminder as sent
        reminder.sent = true;
        await reminder.save();
      }
    } catch (err) {
      console.error("❌ Error checking custom reminders:", err.message);
    }
  });
}

module.exports = startReminderScheduler;
