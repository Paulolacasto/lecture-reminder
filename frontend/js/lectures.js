// js/lectures.js

const API_URL = "http://localhost:5000/api/lectures"; // ✅ adjust if your backend runs elsewhere

document.addEventListener("DOMContentLoaded", () => {
  const lectureForm = document.getElementById("lectureForm");
  const lectureTableBody = document.getElementById("lectureTableBody");

  // Fetch & display lectures
  async function fetchLectures() {
    try {
      const res = await fetch(API_URL);
      const lectures = await res.json();

      lectureTableBody.innerHTML = "";
      lectures.forEach(lecture => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td class="border p-2">${lecture.title}</td>
          <td class="border p-2">${lecture.lecturer}</td>
          <td class="border p-2">${new Date(lecture.date).toLocaleDateString()}</td>
          <td class="border p-2">${lecture.time}</td>
          <td class="border p-2">${lecture.venue}</td>
          <td class="border p-2">${lecture.reminderTime} mins before</td>
          <td class="border p-2 text-center">
            <button onclick="deleteLecture('${lecture._id}')" class="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
          </td>
        `;

        lectureTableBody.appendChild(row);
      });
    } catch (err) {
      console.error("Error fetching lectures:", err);
    }
  }

  // Add new lecture
  lectureForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newLecture = {
      title: document.getElementById("title").value,
      lecturer: document.getElementById("lecturer").value,
      date: document.getElementById("date").value,
      time: document.getElementById("time").value,
      venue: document.getElementById("venue").value,
      reminderTime: parseInt(document.getElementById("reminderTime").value) || 30
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLecture)
      });

      if (res.ok) {
        lectureForm.reset();
        fetchLectures();
      } else {
        const errData = await res.json();
        console.error("Failed to add lecture:", errData.message);
      }
    } catch (err) {
      console.error("Error adding lecture:", err);
    }
  });

  // Delete lecture
  window.deleteLecture = async (id) => {
    if (!confirm("Are you sure you want to delete this lecture?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (res.ok) {
        fetchLectures();
      } else {
        const errData = await res.json();
        console.error("Failed to delete lecture:", errData.message);
      }
    } catch (err) {
      console.error("Error deleting lecture:", err);
    }
  };

  // Initial load
  fetchLectures();
});
