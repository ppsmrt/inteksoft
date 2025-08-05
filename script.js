const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const toggleTheme = document.getElementById('toggleTheme');

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.classList.add(`priority-${task.priority}`);
    li.innerHTML = `
      <strong>${task.title}</strong>
      <div>${task.description}</div>
      <div class="task-meta">By ${task.name} • ${task.priority} • ${task.timestamp}</div>
      <button class="editBtn" onclick="editTask(${index})">Edit</button>
      <button class="deleteBtn" onclick="confirmDelete(${index})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

function confirmDelete(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    deleteTask(index);
  }
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

function editTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const task = tasks[index];
  document.getElementById('taskName').value = task.name;
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDescription').value = task.description;
  document.getElementById('taskPriority').value = task.priority;
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

taskForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('taskName').value.trim();
  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDescription').value.trim();
  const priority = document.getElementById('taskPriority').value;
  const timestamp = new Date().toLocaleString();

  if (name && title && description && priority) {
    const newTask = { name, title, description, priority, timestamp };
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskForm.reset();
    loadTasks();
  }
});

searchInput.addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const tasks = document.querySelectorAll('#taskList li');
  tasks.forEach(task => {
    const content = task.textContent.toLowerCase();
    task.style.display = content.includes(query) ? '' : 'none';
  });
});

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

loadTasks();
