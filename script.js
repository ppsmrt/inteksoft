const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${task.userName} - ${task.title}</strong>
      ${task.description}
      <button class="deleteBtn" onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

taskForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const userName = document.getElementById('userName').value.trim();
  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDescription').value.trim();

  if (userName && title && description) {
    const newTask = { userName, title, description };
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskForm.reset();
    loadTasks();
  }
});

loadTasks();