const users = [
  {
    username: 'alice',
    displayName: 'Alice',
    passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // alice123
    isAdmin: true
  },
  {
    username: 'bob',
    displayName: 'Bob',
    passwordHash: 'bcb1b9b905c31d32a9f5c72a362f8688c81df8c389a88d64b2f5bb3f0eecc1e5', // bob123
    isAdmin: false
  },
  {
    username: 'charlie',
    displayName: 'Charlie',
    passwordHash: 'c2574f878f84c5ee9f0c83d3fd843c670c2f97e44a75878c1952b9a163272c07', // charlie123
    isAdmin: false
  },
  {
    username: 'diana',
    displayName: 'Diana',
    passwordHash: '3f5747fd0c4de3130f8cb7fd5110bbd6f8e7c78858dfc344b504d45e89781c4e', // diana123
    isAdmin: false
  }
];

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
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
  const password = document.getElementById('password').value.trim();
  const hashed = await hashPassword(password);
  const matchedUser = users.find(u => u.username === username && u.passwordHash === hashed);
  if (matchedUser) {
    localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
    showTaskManager(matchedUser);
  } else {
    alert('Invalid username or password.');
  }
});

document.getElementById('logoutBtn').addEventListener('click', function () {
  localStorage.removeItem('loggedInUser');
  location.reload();
});

document.getElementById('taskForm').addEventListener('submit', function (e) {
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

window.updateUser = async function(index) {
  const nameInput = document.querySelectorAll('.nameInput')[index];
  const passInput = document.querySelectorAll('.passInput')[index];
  const newName = nameInput.value.trim();
  const newPass = passInput.value.trim();
  if (newName) users[index].displayName = newName;
  if (newPass) users[index].passwordHash = await hashPassword(newPass);
  alert('User updated (temporarily). Reload page to apply.');
};

window.addEventListener('load', () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user) showTaskManager(user);
});
