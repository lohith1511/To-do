const STORAGE_KEY = "dailyTasks";
const EXPIRY_KEY = "tasksExpiry";

window.onload = function () {
    checkExpiry();
    loadTasks();
};

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (!text) return;

    const tasks = getTasks();
    tasks.push({ text, completed: false });

    saveTasks(tasks);
    input.value = "";
    renderTasks(tasks);
}

function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks(tasks);
}

function toggleTask(index) {
    const tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks(tasks);
}

function getTasks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    if (!localStorage.getItem(EXPIRY_KEY)) {
        localStorage.setItem(EXPIRY_KEY, Date.now() + 86400000);
    }
}

function loadTasks() {
    renderTasks(getTasks());
}

function renderTasks(tasks) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let completedCount = 0;

    tasks.forEach((task, index) => {
        if (task.completed) completedCount++;

        const li = document.createElement("li");

        const left = document.createElement("div");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.onchange = () => toggleTask(index);

        const span = document.createElement("span");
        span.textContent = " " + task.text;
        if (task.completed) span.classList.add("completed");

        left.appendChild(checkbox);
        left.appendChild(span);

        const delBtn = document.createElement("button");
        delBtn.textContent = "❌";
        delBtn.onclick = () => deleteTask(index);

        li.appendChild(left);
        li.appendChild(delBtn);

        list.appendChild(li);
    });

    updateProgress(tasks.length, completedCount);
}

function updateProgress(total, completed) {
    const percent = total === 0 ? 0 : (completed / total) * 100;
    document.getElementById("progressBar").style.width = percent + "%";
    document.getElementById("counter").textContent =
        `${completed} / ${total} completed`;
}

function checkExpiry() {
    const expiry = localStorage.getItem(EXPIRY_KEY);

    if (expiry && Date.now() > expiry) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EXPIRY_KEY);
    }
}

// Dark mode toggle
document.getElementById("darkToggle").onclick = () => {
    document.body.classList.toggle("dark");
};
