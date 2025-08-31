const nodemailer = require("nodemailer");
require("dotenv").config();

// Setup transporter (using Gmail or another provider)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // from .env
    pass: process.env.EMAIL_PASS, // from .env
  },
});

// Send email function
async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: `"Lecture Reminder" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Reminder email sent to:", to);
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
  }
}

module.exports = sendEmail;
