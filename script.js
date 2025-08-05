// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your Firebase Config (from your message)
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

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!name || !title || !description) return;

  await addDoc(collection(db, "tasks"), {
    name,
    title,
    description,
    timestamp: Date.now()
  });

  taskForm.reset();
});

const renderTasks = (tasks) => {
  taskList.innerHTML = '';
  tasks.forEach(docSnap => {
    const task = docSnap.data();
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${task.title}</strong>
      <p>${task.description}</p>
      <small>By: ${task.name}</small>
      <button class="deleteBtn" onclick="deleteTask('${docSnap.id}')">Delete</button>
    `;
    taskList.appendChild(li);
  });
};

// Sync tasks in real time
onSnapshot(collection(db, "tasks"), (snapshot) => {
  renderTasks(snapshot.docs);
});

window.deleteTask = async (id) => {
  await deleteDoc(doc(db, "tasks", id));
};