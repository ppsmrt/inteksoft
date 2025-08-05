async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function checkLogin() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user) {
    showTaskManager(user);
  } else {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('taskContainer').style.display = 'none';
  }
}

function showTaskManager(user) {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('taskContainer').style.display = 'block';
  document.getElementById('currentUser').innerText = user.displayName;
  renderTasks();
  if (user.isAdmin) renderAdminPanel();
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const hashedInput = await hashPassword(password);
  const matchedUser = users.find(u => u.username === username && u.passwordHash === hashedInput);
  if (matchedUser) {
    localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
    showTaskManager(matchedUser);
  } else {
    alert('Invalid username or password.');
  }
});

document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('loggedInUser');
  location.reload();
});

document.getElementById('taskForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDescription').value.trim();
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const task = {
    id: Date.now(),
    title,
    description,
    assignedBy: user.displayName
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
    li.innerHTML = `<strong>${task.title}</strong><br>${task.description}<br><em>By: ${task.assignedBy}</em>`;
    taskList.appendChild(li);
  });
}

function renderAdminPanel() {
  const adminPanel = document.getElementById('adminPanel');
  adminPanel.style.display = 'block';
  const userList = document.getElementById('userList');
  userList.innerHTML = '';
  users.forEach((u, i) => {
    const li = document.createElement('li');
    li.classList.add('admin-edit');
    li.innerHTML = `
      <input type="text" value="${u.displayName}" data-index="${i}" class="nameInput" />
      <input type="password" placeholder="New Password" data-index="${i}" class="passInput" />
      <button onclick="updateUser(${i})">Update</button>
    `;
    userList.appendChild(li);
  });
}

async function updateUser(index) {
  const nameInput = document.querySelectorAll('.nameInput')[index];
  const passInput = document.querySelectorAll('.passInput')[index];
  const newName = nameInput.value.trim();
  const newPass = passInput.value.trim();
  if (newName) users[index].displayName = newName;
  if (newPass) users[index].passwordHash = await hashPassword(newPass);
  alert('User updated. Reload to apply.');
}

checkLogin();
