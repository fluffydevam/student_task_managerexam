// Define the localStorage key for tasks
const STORAGE_KEY = "tasks";
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
// Get references to the form and task list elements
const form = document.getElementById("taskForm");
const list = document.getElementById("taskList");
const search = document.getElementById("search");
const themeButton = document.getElementById("themeButton");

function updateThemeIcon() {
  if (!themeButton) return;
  themeButton.innerHTML = document.body.classList.contains("dark")
    ? '<i class="bi bi-sun"></i>'
    : '<i class="bi bi-moon"></i>';
}

themeButton?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
  updateThemeIcon();
});
// Check if dark mode is enabled in localStorage
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}
updateThemeIcon();

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
// Show the tasks in the list
function showTasks() {
  if (!list) return;

  const text = search ? search.value.toLowerCase() : "";
  const visibleTasks = tasks.filter((task) => task.title.toLowerCase().includes(text));

  list.innerHTML = visibleTasks.map((task) => `
    <div class="list-group-item d-flex justify-content-between align-items-center ${task.done ? "completed" : ""}">
      <div class="task-title"><i class="bi bi-card-checklist me-2"></i>${task.title}<small class="d-block text-muted">Due: ${task.date} | Priority: ${task.priority}</small></div>
      <div class="btn-group">
        <button class="btn btn-sm btn-success" data-action="done" data-id="${task.id}" title="Complete"><i class="bi bi-check2"></i></button>
        <button class="btn btn-sm btn-warning" data-action="edit" data-id="${task.id}" title="Edit"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-danger" data-action="delete" data-id="${task.id}" title="Delete"><i class="bi bi-trash"></i></button>
      </div>
    </div>`).join("");

  document.getElementById("total").textContent = tasks.length;
  document.getElementById("completed").textContent = tasks.filter((task) => task.done).length;
  document.getElementById("pending").textContent = tasks.filter((task) => !task.done).length;
}

// Clear form fields and reset the form state
function clearForm() {
  form.reset();
  document.getElementById("editId").value = "";
  document.getElementById("submitButton").textContent = "Add Task";
  document.getElementById("formMessage").textContent = "";
}

// Add event listeners to the form and task list
if (form) {
  search.addEventListener("input", showTasks);

  document.getElementById("clearButton").addEventListener("click", () => {
    if (confirm("Delete all tasks?")) {
      tasks = [];
      saveTasks();
      showTasks();
    }
  });
// Add event listener for form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value.trim();
    const date = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;
    const editId = document.getElementById("editId").value;

    if (!title || !date) {
      document.getElementById("formMessage").textContent = "Title and due date are required.";
      return;
    }

    if (editId) {
      tasks = tasks.map((task) => task.id == editId ? { ...task, title, date, priority } : task);
    } else {
      tasks.push({ id: Date.now(), title, date, priority, done: false });
    }

    saveTasks();
    showTasks();
    clearForm();
  });
// Add event listener for task list actions (done, edit, delete)
  list.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const task = tasks.find((item) => item.id == button.dataset.id);
    if (button.dataset.action === "done") task.done = !task.done;
    if (button.dataset.action === "delete") tasks = tasks.filter((item) => item.id != task.id);
    if (button.dataset.action === "edit") {
      document.getElementById("title").value = task.title;
      document.getElementById("dueDate").value = task.date;
      document.getElementById("priority").value = task.priority;
      document.getElementById("editId").value = task.id;
      document.getElementById("submitButton").textContent = "Update Task";
      return;
    }
    saveTasks();
    showTasks();
  });

  showTasks();
}
