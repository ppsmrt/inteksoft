document.getElementById('taskForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDescription').value.trim();
  const assignedBy = document.getElementById('assignedBy').value;

  const task = {
    id: Date.now(),
    title,
    description,
    assignedBy
  };

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  this.reset();
  renderTasks();
});

function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${task.title}</strong><br>${task.description}<br><em>Assigned By: ${task.assignedBy}</em>`;
    taskList.appendChild(li);
  });
}

// Initial render
renderTasks();
