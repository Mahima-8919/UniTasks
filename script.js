let tasks = [];

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

    if (task === "") {
        return;
    }

    let hours = document.getElementById("reminderHours").value;

    tasks.push({
        text: task,
        completed: false,
        reminderHours: hours ? parseInt(hours) : 1,
        addedTime: Date.now()
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTask(tasks[tasks.length - 1], tasks.length - 1);

    document.getElementById("TI").value = "";
}

// Display Task
function displayTask(task, index) {

    let li = document.createElement("li");

    li.innerText =
        (task.completed ? "☑ " : "☐ ")
        + task.text + " ";

    let completeBtn = document.createElement("button");

    completeBtn.innerText = "Complete";

    completeBtn.onclick = function () {
        toggleComplete(index);
    };

    li.appendChild(completeBtn);

    let deleteBtn = document.createElement("button");

    deleteBtn.innerText = "Delete";

    deleteBtn.onclick = function () {
        deleteTask(index);
    };

    li.appendChild(deleteBtn);

    document.getElementById("taskList").appendChild(li);
}

// Delete Task
function deleteTask(index) {

    tasks.splice(index, 1);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.getElementById("taskList").innerHTML = "";

    tasks.forEach((task, i) => {
        displayTask(task, i);
    });
}

// Complete Task
function toggleComplete(index) {

    tasks[index].completed =
        !tasks[index].completed;

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    document.getElementById("taskList").innerHTML = "";

    tasks.forEach((task, i) => {
        displayTask(task, i);
    });
}
