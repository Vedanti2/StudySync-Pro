/* ==========================
   StudySync Pro - script.js
========================== */

// Task Statistics
let totalTasks = 0;
let completedTasks = 0;

// Load saved data on page load
window.onload = function () {
    loadTasks();
    loadNotes();
    updateStats();
};

// ======================
// TASK MANAGER
// ======================

function addTask() {

    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    createTask(taskText, false);

    saveTasks();

    input.value = "";
}

function createTask(taskText, completed) {

    const taskList = document.getElementById("taskList");

    const li = document.createElement("li");

    if (completed) {
        li.style.textDecoration = "line-through";
    }

    li.innerHTML = `
        <span>${taskText}</span>
        <div>
            <button onclick="completeTask(this)">
                ✓
            </button>
            <button onclick="deleteTask(this)">
                ✕
            </button>
        </div>
    `;

    taskList.appendChild(li);

    totalTasks++;

    if (completed) {
        completedTasks++;
    }

    updateStats();
}

function completeTask(button) {

    const task =
        button.parentElement.parentElement;

    if (task.style.textDecoration !== "line-through") {

        task.style.textDecoration =
            "line-through";

        completedTasks++;

        updateStats();

        saveTasks();
    }
}

function deleteTask(button) {

    const task =
        button.parentElement.parentElement;

    if (task.style.textDecoration === "line-through") {
        completedTasks--;
    }

    totalTasks--;

    task.remove();

    updateStats();

    saveTasks();
}

// ======================
// DASHBOARD STATS
// ======================

function updateStats() {

    document.getElementById("totalTasks")
        .innerText = totalTasks;

    document.getElementById("completedTasks")
        .innerText = completedTasks;

    let rate = 0;

    if (totalTasks > 0) {
        rate = Math.round(
            (completedTasks / totalTasks) * 100
        );
    }

    document.getElementById("completionRate")
        .innerText = rate + "%";
}

// ======================
// LOCAL STORAGE TASKS
// ======================

function saveTasks() {

    const taskItems =
        document.querySelectorAll("#taskList li");

    let tasks = [];

    taskItems.forEach(task => {

        tasks.push({
            text:
                task.querySelector("span").innerText,
            completed:
                task.style.textDecoration ===
                "line-through"
        });
    });

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function loadTasks() {

    const tasks =
        JSON.parse(localStorage.getItem("tasks"))
        || [];

    tasks.forEach(task => {
        createTask(task.text, task.completed);
    });
}

// ======================
// NOTES SECTION
// ======================

function saveNotes() {

    const notes =
        document.getElementById("notes").value;

    localStorage.setItem(
        "notes",
        notes
    );

    alert("Notes Saved Successfully!");
}

function loadNotes() {

    const savedNotes =
        localStorage.getItem("notes");

    if (savedNotes) {

        document.getElementById("notes")
            .value = savedNotes;
    }
}

// ======================
// DARK MODE
// ======================

const themeBtn =
    document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (
        document.body.classList.contains("dark")
    ) {
        localStorage.setItem(
            "theme",
            "dark"
        );
    } else {
        localStorage.setItem(
            "theme",
            "light"
        );
    }
});

// Load theme
const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

// ======================
// POMODORO TIMER
// ======================

let timer;
let totalSeconds = 1500; // 25 mins

function startTimer() {

    clearInterval(timer);

    timer = setInterval(() => {

        let minutes =
            Math.floor(totalSeconds / 60);

        let seconds =
            totalSeconds % 60;

        document.getElementById("timer")
            .innerText =
            `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        totalSeconds--;

        if (totalSeconds < 0) {

            clearInterval(timer);

            alert(
                "🎉 Pomodoro Session Completed!"
            );

            totalSeconds = 1500;

            document.getElementById("timer")
                .innerText = "25:00";
        }

    }, 1000);
}

function resetTimer() {

    clearInterval(timer);

    totalSeconds = 1500;

    document.getElementById("timer")
        .innerText = "25:00";
}

// ======================
// ENTER KEY SUPPORT
// ======================

document
.getElementById("taskInput")
.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        addTask();
    }
});