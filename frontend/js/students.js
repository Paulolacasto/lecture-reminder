const STUDENT_API_URL = "http://localhost:5000/api/students";

// DOM Elements
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");

// Fetch all students on page load
async function fetchStudents() {
  try {
    const res = await fetch(STUDENT_API_URL);
    const students = await res.json();

    studentTableBody.innerHTML = ""; // clear old
    students.forEach(student => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border p-2">${student.name}</td>
        <td class="border p-2">${student.email}</td>
        <td class="border p-2">${student.phone}</td>
        <td class="border p-2">${student.department}</td>
        <td class="border p-2">
          <button onclick="deleteStudent('${student._id}')" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
        </td>
      `;
      studentTableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error fetching students:", err);
  }
}

// Add new student
studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const student = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    department: document.getElementById("department").value
  };

  try {
    const res = await fetch(STUDENT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });

    if (res.ok) {
      studentForm.reset();
      fetchStudents(); // refresh table
    } else {
      console.error("Failed to add student");
    }
  } catch (err) {
    console.error("Error adding student:", err);
  }
});

// Delete student
async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  try {
    const res = await fetch(`${STUDENT_API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchStudents();
    } else {
      console.error("Failed to delete student");
    }
  } catch (err) {
    console.error("Error deleting student:", err);
  }
}

// Initial load
fetchStudents();
