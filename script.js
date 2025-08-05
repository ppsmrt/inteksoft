const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const darkModeToggle = document.getElementById('darkModeToggle');
const searchInput = document.getElementById('searchInput');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filteredTasks = tasks) {
  taskList.innerHTML = '';
  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${task.title}</strong>
      ${task.description}<br>
      <span class="task-meta">Added by ${task.name} | ${task.priority} | ${task.timestamp}</span>
      <button class="deleteBtn" onclick="deleteTask(${index})">Delete</button>
      <button class="editBtn" onclick="editTask(${index})">Edit</button>
    `;
    taskList.appendChild(li);
  });
}

function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function editTask(index) {
  const task = tasks[index];
  document.getElementById('taskName').value = task.name;
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDescription').value = task.description;
  document.getElementById('taskPriority').value = task.priority;
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('taskName').value.trim();
  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDescription').value.trim();
  const priority = document.getElementById('taskPriority').value;
  const timestamp = new Date().toLocaleString();

  if (name && title && description) {
    const newTask = { name, title, description, priority, timestamp };
    tasks.push(newTask);
    saveTasks();
    taskForm.reset();
    renderTasks();
  }
});

searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = tasks.filter(task =>
    task.title.toLowerCase().includes(keyword) ||
    task.description.toLowerCase().includes(keyword) ||
    task.name.toLowerCase().includes(keyword)
  );
  renderTasks(filtered);
});

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

renderTasks();
```
    }
  ]
}
