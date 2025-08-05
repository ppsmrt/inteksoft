import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, deleteDoc, updateDoc,
  onSnapshot, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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
const taskCol = collection(db, "tasks");

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

let editId = null;

onSnapshot(taskCol, snapshot => {
  taskList.innerHTML = "";
  snapshot.forEach(docSnap => {
    const t = docSnap.data();
    const li = document.createElement("li");
    li.dataset.priority = t.priority;
    li.innerHTML = `
      <strong>${t.name}</strong>
      <div class="task-details"><b>${t.title}</b><br>${t.description}</div>
      <div class="task-meta">${new Date(t.created.toMillis()).toLocaleString()} • ${t.status}</div>
      <button class="editBtn" onclick="startEdit('${docSnap.id}', '${t.name}', '${t.title}', '${t.description}', '${t.priority}', '${t.status}')">Edit</button>
      <button class="deleteBtn" onclick="deleteTask('${docSnap.id}')">✖</button>
    `;
    taskList.appendChild(li);
  });
});

taskForm.addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("userName").value.trim();
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const status = document.getElementById("taskStatus").value;

  if (!name || !title || !description) return;
  const data = { name, title, description, priority, status, created: serverTimestamp() };

  if (editId) {
    await updateDoc(doc(db, "tasks", editId), data);
    editId = null;
    taskForm.reset();
  } else {
    await addDoc(taskCol, data);
  }
});

window.deleteTask = async id => {
  if (confirm("Delete this task?")) {
    await deleteDoc(doc(db, "tasks", id));
  }
};

window.startEdit = (id, name, title, desc, priority, status) => {
  editId = id;
  document.getElementById("userName").value = name;
  document.getElementById("taskTitle").value = title;
  document.getElementById("taskDescription").value = desc;
  document.getElementById("taskPriority").value = priority;
  document.getElementById("taskStatus").value = status;
};