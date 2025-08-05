// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, onSnapshot, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

const taskCol = collection(db, "tasks");

onSnapshot(taskCol, (snapshot) => {
  taskList.innerHTML = "";
  snapshot.forEach((docItem) => {
    const task = docItem.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.name}</strong>
      <div><b>${task.title}</b></div>
      <div>${task.description}</div>
      <small>${new Date(task.created).toLocaleString()}</small>
      <button class="deleteBtn" onclick="deleteTask('${docItem.id}')">✖</button>
    `;
    taskList.appendChild(li);
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  if (name && title && description) {
    await addDoc(taskCol, {
      name,
      title,
      description,
      created: Date.now()
    });
    taskForm.reset();
  }
});

window.deleteTask = async (id) => {
  await deleteDoc(doc(db, "tasks", id));
};