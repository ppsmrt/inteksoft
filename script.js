import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOdDEfI5_LA9wtk8WAdSq3XBn-ppoUHvY",
  authDomain: "tasks-web-app-new.firebaseapp.com",
  projectId: "tasks-web-app-new",
  storageBucket: "tasks-web-app-new.firebasestorage.app",
  messagingSenderId: "757740956566",
  appId: "1:757740956566:web:1602a1c68d442591008bb7",
  measurementId: "G-TZTG841QNJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

// 🌓 Toggle Dark Mode
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("taskName").value.trim();
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const priority = document.getElementById("taskPriority").value;

  if (!name || !title || !description) return;

  await addDoc(collection(db, "tasks"), {
    name,
    title,
    description,
    priority,
    timestamp: serverTimestamp()
  });

  taskForm.reset();
});

// Live updates
onSnapshot(collection(db, "tasks"), (snapshot) => {
  taskList.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const task = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.title}</strong><br>
      <em>👤 ${task.name}</em><br>
      <p>${task.description}</p>
      <span>⏰ ${task.timestamp?.toDate().toLocaleString() || 'Just now'}</span><br>
      <span>🚦 Priority: ${task.priority}</span>
      <button class="deleteBtn" onclick="deleteTask('${docSnap.id}')">Delete</button>
    `;
    taskList.appendChild(li);
  });
});

// Delete function (attached to global scope)
window.deleteTask = async function(id) {
  await deleteDoc(doc(db, "tasks", id));
};