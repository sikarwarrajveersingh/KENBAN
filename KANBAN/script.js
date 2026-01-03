let tasksData = {};
let dragElement = null;

// Columns
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');

const columns = [todo, progress, done];

// ---------------- LOAD FROM LOCAL STORAGE ----------------
if (localStorage.getItem('tasksData')) {
  tasksData = JSON.parse(localStorage.getItem('tasksData'));

  for (const colId in tasksData) {
    const column = document.querySelector(`#${colId}`);
    if (!column) continue;

    tasksData[colId].forEach(task => {
      createTask(task.title, task.desc, column);
    });
  }
}

updateCounts();

// ---------------- CREATE TASK FUNCTION ----------------
function createTask(title, desc, column) {
  const div = document.createElement('div');
  div.classList.add('task');
  div.setAttribute('draggable', 'true');

  div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button class="delete-btn">Delete</button>
  `;

  column.appendChild(div);

  // Drag
  div.addEventListener('dragstart', () => {
    dragElement = div;
  });

  // Delete
  div.querySelector('.delete-btn').addEventListener('click', () => {
    div.remove();
    saveToLocalStorage();
    updateCounts();
  });
}

// ---------------- DRAG EVENTS FOR COLUMNS ----------------
function addDragEvents(column) {
  column.addEventListener('dragover', e => e.preventDefault());

  column.addEventListener('dragenter', () => {
    column.classList.add('hover-over');
  });

  column.addEventListener('dragleave', () => {
    column.classList.remove('hover-over');
  });

  column.addEventListener('drop', () => {
    if (!dragElement) return;

    column.appendChild(dragElement);
    column.classList.remove('hover-over');

    saveToLocalStorage();
    updateCounts();
  });
}

columns.forEach(addDragEvents);

// ---------------- SAVE TO LOCAL STORAGE ----------------
function saveToLocalStorage() {
  tasksData = {};

  columns.forEach(col => {
    const tasks = col.querySelectorAll('.task');
    tasksData[col.id] = Array.from(tasks).map(t => ({
      title: t.querySelector('h2').innerText,
      desc: t.querySelector('p').innerText
    }));
  });

  localStorage.setItem('tasksData', JSON.stringify(tasksData));
}

// ---------------- UPDATE COUNTS ----------------
function updateCounts() {
  columns.forEach(col => {
    const count = col.querySelector('.heading .right');
    const tasks = col.querySelectorAll('.task');
    if (count) count.innerText = tasks.length;
  });
}

// ---------------- MODAL LOGIC ----------------
const toggleModalButton = document.querySelector('#toggle-modal');
const bgModal = document.querySelector('.modal .bg');
const modal = document.querySelector('.modal');
const addTaskButton = document.querySelector('#add-new-task');

toggleModalButton.addEventListener('click', () => {
  modal.classList.toggle('active');
});

bgModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

// ---------------- ADD NEW TASK ----------------
addTaskButton.addEventListener('click', () => {
  const titleInput = document.querySelector('#task-title-input');
  const descInput = document.querySelector('#task-desc-input');

  const title = titleInput.value.trim();
  const desc = descInput.value.trim();

  if (!title) return alert('Task title required');

  createTask(title, desc, todo);

  titleInput.value = '';
  descInput.value = '';

  saveToLocalStorage();
  updateCounts();

  modal.classList.remove('active');
});
