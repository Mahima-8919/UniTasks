let tasks = [];
let swReg;

// Register Service Worker
Notification.requestPermission();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(reg) {
        swReg = reg;
    });
}

// Load tasks when page opens
window.onload = function () {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        tasks.forEach((task, i) => {
            displayTask(task, i);
        });
    }
};

// Add Task
function addTask() {
    let task = document.getElementById("TI").value;
    if (task === "") return;

    let hours = document.getElementById("reminderHours").value;
    let mins = document.getElementById("reminderMins").value;

    tasks.push({
        text: task,
        completed: false,
        reminderHours: hours ? parseInt(hours) : 0,
        reminderMins: mins ? parseInt(mins) : 1,
        addedTime: Date.now()
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTask(tasks[tasks.length - 1], tasks.length - 1);
    document.getElementById("TI").value = "";
    document.getElementById("reminderHours").value = "";
    document.getElementById("reminderMins").value = "";
}

// Display Task
function displayTask(task, index) {
    let li = document.createElement("li");

    let span = document.createElement("span");
    span.innerText = (task.completed ? "☑ " : "☐ ") + task.text + " ⏰ " + task.reminderHours + "h " + task.reminderMins + "m";
    span.style.textDecoration = task.completed ? "line-through" : "none";
    span.style.color = task.completed ? "#aaa" : "#333";
    li.appendChild(span);

    let completeBtn = document.createElement("button");
    completeBtn.innerText = "Complete";
    completeBtn.onclick = function () { toggleComplete(index); };
    li.appendChild(completeBtn);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = function () { deleteTask(index); };
    li.appendChild(deleteBtn);

    document.getElementById("taskList").appendChild(li);
}

// Delete Task
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById("taskList").innerHTML = "";
    tasks.forEach((task, i) => { displayTask(task, i); });
}

// Complete Task
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById("taskList").innerHTML = "";
    tasks.forEach((task, i) => { displayTask(task, i); });
}

// Check tasks every minute
setInterval(function () {
    let now = Date.now();
    tasks.forEach(function (task) {
        if (task.completed) return;

        let elapsed = now - task.addedTime;
        let reminderInterval = ((task.reminderHours * 60) + task.reminderMins) * 60 * 1000;

        if (elapsed >= reminderInterval) {
            if (swReg) {
                swReg.showNotification("UniTasks Reminder 🔔", {
                    body: "Task not done yet: " + task.text
                });
            } else {
                alert("⏰ UniTasks Reminder!\nTask not done yet: " + task.text);
            }

            // Sound alert
            let audio = new AudioContext();
            let beep = audio.createOscillator();
            beep.connect(audio.destination);
            beep.start();
            beep.stop(audio.currentTime + 0.5);

            // Reset timer
            task.addedTime = Date.now();
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    });
}, 60000);

// Test Reminder
function testReminder() {
    if (swReg) {
        swReg.showNotification("UniTasks Reminder 🔔", {
            body: "Test notification!"
        });
    } else {
        alert("⏰ UniTasks Reminder!\nTest notification!");
    }
}
