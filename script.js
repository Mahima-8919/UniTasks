let tasks = [];

// Load tasks when page opens
window.onload = function() {

    let savedTasks = localStorage.getItem("tasks");

    if(savedTasks) {
        tasks = JSON.parse(savedTasks);

        for(let task of tasks) {
            displayTask(task);
        }
    }
};

// Add Task
function addTask() {

    let task = document.getElementById("TI").value;

    if(task === "") {
        return;
    }

    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTask(task);

    document.getElementById("TI").value = "";
}

// Display Task
function displayTask(task) {

    let li = document.createElement("li");

    li.innerText = task;

    document.getElementById("taskList").appendChild(li);
}
