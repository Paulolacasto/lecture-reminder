// js/reminders.js

// Load lectures and students on page load
document.addEventListener("DOMContentLoaded", async () => {
  await loadLectures();
  await loadStudents();
  await loadReminders();

  // Handle form submission
  document.getElementById("reminderForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const lecture = document.getElementById("lecture").value;
    const message = document.getElementById("message").value;
    const reminderTime = document.getElementById("reminderTime").value;

    // Get selected students
    const selectedStudents = Array.from(
      document.querySelectorAll("input[name='student']:checked")
    ).map((cb) => cb.value);

    try {
      const res = await fetch("http://localhost:5000/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lecture,
          students: selectedStudents,
          message,
          reminderTime,
        }),
      });

      if (res.ok) {
        alert("✅ Reminder saved successfully!");
        document.getElementById("reminderForm").reset();
        await loadReminders();
      } else {
        const err = await res.json();
        alert("❌ Failed to save reminder: " + err.error);
      }
    } catch (error) {
      console.error("Error saving reminder:", error);
      alert("❌ Error saving reminder");
    }
  });
});

// Load lectures into dropdown
async function loadLectures() {
  try {
    const res = await fetch("http://localhost:5000/api/lectures");
    const lectures = await res.json();
    const lectureSelect = document.getElementById("lecture");
    lectureSelect.innerHTML = "";

    if (lectures.length === 0) {
      lectureSelect.innerHTML = `<option disabled>No lectures available</option>`;
      return;
    }

    lectures.forEach((lecture) => {
      const option = document.createElement("option");
      option.value = lecture._id;
      option.textContent = `${lecture.title} - ${new Date(lecture.date).toLocaleDateString()} (${lecture.time})`;
      lectureSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading lectures:", err);
  }
}

// Load students into checkbox list
async function loadStudents() {
  try {
    const res = await fetch("http://localhost:5000/api/students");
    const students = await res.json();
    const studentList = document.getElementById("studentList");
    studentList.innerHTML = "";

    students.forEach((student) => {
      const label = document.createElement("label");
      label.className = "block";
      label.innerHTML = `
        <input type="checkbox" name="student" value="${student._id}" class="mr-2">
        ${student.name} (${student.email})
      `;
      studentList.appendChild(label);
    });
  } catch (err) {
    console.error("Error loading students:", err);
  }
}

// Load reminders into table
async function loadReminders() {
  try {
    const res = await fetch("http://localhost:5000/api/reminders");
    const reminders = await res.json();
    const tbody = document.getElementById("reminderTableBody");
    tbody.innerHTML = "";

    reminders.forEach((reminder) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="border p-2">${reminder.lecture?.title || "N/A"}</td>
        <td class="border p-2">${reminder.message}</td>
        <td class="border p-2">${reminder.reminderTime} minutes before</td>
        <td class="border p-2">
          ${reminder.students?.map((s) => s.name).join(", ") || "None"}
        </td>
        <td class="border p-2">
          ${reminder.sent ? "✅ Sent" : "⏳ Pending"}
        </td>
        <td class="border p-2">
          <button 
            class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            onclick="deleteReminder('${reminder._id}')"
          >
            Delete
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading reminders:", err);
  }
}

// Delete reminder
async function deleteReminder(id) {
  if (!confirm("Are you sure you want to delete this reminder?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/reminders/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("🗑️ Reminder deleted");
      await loadReminders();
    } else {
      const err = await res.json();
      alert("❌ Failed to delete reminder: " + err.error);
    }
  } catch (error) {
    console.error("Error deleting reminder:", error);
  }
}
