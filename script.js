window.onload = function () {
  showWelcome();
  loadTasks();
  showQuote();
  updateProgress();
};

/* 🔔 Notification permission */
if ("Notification" in window) {
  Notification.requestPermission();
}

/* 🔐 Welcome Message */
function showWelcome() {
  let name = localStorage.getItem("username");

  if (name) {
    document.getElementById("welcome").innerText =
      "Hello " + name + " 👋 Welcome back!";
  }
}

/* 💪 Motivation Quotes */
function showQuote() {
  let quotes = [
    "Success is the sum of small efforts repeated daily 💪",
    "Don’t stop until you’re proud 🔥",
    "Study hard, your future self will thank you 📚",
    "Discipline beats motivation every time ⚡",
    "Small progress is still progress 🚀"
  ];

  let randomIndex = Math.floor(Math.random() * quotes.length);

  document.getElementById("quote").innerText = quotes[randomIndex];
}

/* ➕ Add Task */
function addTask() {
  let taskInput = document.getElementById("taskInput");
  let taskTime = document.getElementById("taskTime");

  let taskText = taskInput.value;
  let time = taskTime.value;

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  let tasks = getTasks();

  tasks.push({
    text: taskText,
    time: time,
    done: false,
    notified: false
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskInput.value = "";
  taskTime.value = "";

  loadTasks();
  updateProgress();
}

/* 📋 Load Tasks */
function loadTasks() {
  let taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  let tasks = getTasks();

  tasks.forEach((task, index) => {
    let li = document.createElement("li");

    li.innerHTML =
      "<input type='checkbox' onchange='toggleDone(" + index + ")' " +
      (task.done ? "checked" : "") +
      "> 📚 " + task.text +
      " ⏰ " + task.time +
      " <button onclick='deleteTask(" + index + ")'>❌</button>";

    taskList.appendChild(li);
  });
}

/* ❌ Delete Task */
function deleteTask(index) {
  let tasks = getTasks();
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
  updateProgress();
}

/* ✅ Toggle Done */
function toggleDone(index) {
  let tasks = getTasks();
  tasks[index].done = !tasks[index].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateProgress();
}

/* 💾 Get Tasks */
function getTasks() {
  let tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

/* 🌙 Dark Mode */
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

/* 📊 Progress Tracker */
function updateProgress() {
  let tasks = getTasks();

  let progressText = document.getElementById("progressText");
  let progressBar = document.getElementById("progressBar");

  if (!progressText || !progressBar) return;

  if (tasks.length === 0) {
    progressText.innerText = "Progress: 0%";
    progressBar.value = 0;
    return;
  }

  let completed = tasks.filter(t => t.done === true).length;
  let percent = Math.round((completed / tasks.length) * 100);

  progressText.innerText = "Progress: " + percent + "%";
  progressBar.value = percent;
}

/* 🔔 Real Notification Reminder */
setInterval(() => {
  let tasks = getTasks();

  let now = new Date();
  let currentTime =
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0");

  tasks.forEach(task => {
    if (task.time === currentTime && task.notified !== true) {

      if (Notification.permission === "granted") {
        new Notification("⏰ Study Reminder", {
          body: task.text
        });
      } else {
        alert("⏰ Reminder: " + task.text);
      }

      task.notified = true;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  });

}, 60000);
function clearTasks() {
  localStorage.removeItem("tasks");
  loadTasks();
  updateProgress();
}