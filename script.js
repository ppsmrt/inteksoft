import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

const tasksRef = collection(db, "tasks");

async function loadTasks() {
  const querySnapshot = await getDocs(tasksRef);
  taskList.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const task = docSnap.data();
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="task-content">
        <strong>${task.title}</strong>
        <p>${task.description}</p>
        <small>By: ${task.name} • Priority: ${task.priority} • Status: ${task.status || "Pending"}</small>
      </div>
      <div class="task-actions">
        <button onclick="editTask('${docSnap.id}')">✏️ Edit</button>
        <button onclick="deleteTask('${docSnap.id}')">🗑️ Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

window.deleteTask = async function (id) {
  await deleteDoc(doc(db, "tasks", id));
  loadTasks();
};

window.editTask = async function (id) {
  const newStatus = prompt("Update Status (Pending, In Progress, Done):");
  if (!newStatus) return;

  await updateDoc(doc(db, "tasks", id), {
    status: newStatus
  });

  loadTasks();
};

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("taskName").value.trim();
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const priority = document.getElementById("taskPriority").value;

  if (!name || !title || !description || !priority) return;

  await addDoc(tasksRef, {
    name,
    title,
    description,
    priority,
    status: "Pending",
    createdAt: new Date()
  });

  taskForm.reset();
  loadTasks();
});

loadTasks();