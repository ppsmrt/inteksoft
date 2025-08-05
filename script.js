import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, deleteDoc, updateDoc,
  onSnapshot, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your Firebase config
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
const tasksCol = collection(db, "tasks");

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
let editId = null;

onSnapshot(tasksCol, snapshot => {
  taskList.innerHTML = "";
  snapshot.forEach(docSnap => {
    const t = docSnap.data();
    const li = document.createElement("div");
    li.className = "task-card";
    li.innerHTML = `
      <div class="task-title">${t.title}</div>
      <div class="task-desc">${t.description}</div>
      <div class="task-meta">${new Date(t.created.toMillis()).toLocaleString()} • ${t.status}</div>
      <div class="task-priority" priority="${t.priority}"></div>
      <button class="editBtn" onclick="startEdit('${docSnap.id}', '${t.title}', '${t.description}', '${t.priority}', '${t.status}')">Edit</button>
      <button class="deleteBtn" onclick="deleteTask('${docSnap.id}')">✖</button>
      <button class="statusBtn" onclick="toggleStatus('${docSnap.id}', '${t.status}')">${t.status}</button>
    `;
    taskList.appendChild(li);
  });
});

taskForm.addEventListener("submit", async e => {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const priority = document.querySelector('input[name="priority"]:checked').value;
  const status = editId ? null : "Pending";

  if (!title || !description) return;

  const data = {
    title, description, priority,
    ...(editId ? {} : { status }),
    created: serverTimestamp()
  };

  if (editId) {
    await updateDoc(doc(tasksCol, editId), data);
    editId = null;
  } else {
    await addDoc(tasksCol, data);
  }

  taskForm.reset();
});

window.deleteTask = async id => {
  if (confirm("Delete this task?")) {
    await deleteDoc(doc(tasksCol, id));
  }
};

window.startEdit = (id, title, desc, priority, status) => {
  editId = id;
  document.getElementById("taskTitle").value = title;
  document.getElementById("taskDescription").value = desc;
  document.querySelector(`input[name="priority"][value="${priority}"]`).checked = true;
};

window.toggleStatus = async (id, current) => {
  const newStatus = current === "Pending" ? "Done" : "Pending";
  await updateDoc(doc(tasksCol, id), { status: newStatus });
};