const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.checked = true;
}

// Toggle theme
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Load tasks
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="name">👤 ${task.name}</div>
      <strong>${task.title}</strong>
      ${task.description}
      <button class="deleteBtn" onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

// Delete task
function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

// Add task
taskForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('taskName').value.trim();
  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDescription').value.trim();
  if (name && title && description) {
    const newTask = { name, title, description };
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskForm.reset();
    loadTasks();
  }
});

loadTasks();