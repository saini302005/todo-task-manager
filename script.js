// ==================== GET HTML ELEMENTS ====================

const taskInput =
    document.getElementById("task-input");

const addTaskButton =
    document.getElementById("add-task-button");

const taskList =
    document.getElementById("task-list");

const taskCount =
    document.getElementById("task-count");

const filterButtons =
    document.querySelectorAll(".filter-button");

const clearCompletedButton =
    document.getElementById(
        "clear-completed-button"
    );


// ==================== LOAD TASKS ====================

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];


// ==================== CURRENT FILTER ====================

let currentFilter = "all";


// ==================== SAVE TASKS ====================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ==================== ADD TASK ====================

function addTask() {

    const taskText =
        taskInput.value.trim();


    if (taskText === "") {

        alert("Please enter a task.");

        return;
    }


    const task = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    tasks.push(task);

    saveTasks();

    renderTasks();

    taskInput.value = "";

    taskInput.focus();

}


// ==================== ADD BUTTON ====================

addTaskButton.addEventListener(
    "click",
    addTask
);


// ==================== ENTER KEY ====================

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ==================== FILTER TASKS ====================

function getFilteredTasks() {

    if (currentFilter === "active") {

        return tasks.filter(
            function (task) {

                return !task.completed;

            }
        );

    }


    if (currentFilter === "completed") {

        return tasks.filter(
            function (task) {

                return task.completed;

            }
        );

    }


    return tasks;

}


// ==================== RENDER TASKS ====================

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        getFilteredTasks();


    // ==================== NO TASKS ====================

    if (filteredTasks.length === 0) {

        const emptyMessage =
            document.createElement("li");

        emptyMessage.classList.add(
            "empty-message"
        );

        if (currentFilter === "completed") {

            emptyMessage.textContent =
                "No completed tasks.";

        } else if (currentFilter === "active") {

            emptyMessage.textContent =
                "No active tasks.";

        } else {

            emptyMessage.textContent =
                "No tasks yet. Add your first task!";

        }

        taskList.appendChild(
            emptyMessage
        );

    }


    // ==================== CREATE TASKS ====================

    filteredTasks.forEach(
        function (task) {

            createTaskElement(task);

        }
    );


    updateTaskCount();

}


// ==================== CREATE TASK ====================

function createTaskElement(task) {

    const taskItem =
        document.createElement("li");


    // ==================== TASK CONTENT ====================

    const taskContent =
        document.createElement("div");

    taskContent.classList.add(
        "task-content"
    );


    // ==================== CHECKBOX ====================

    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.checked =
        task.completed;


    // ==================== TASK TEXT ====================

    const taskText =
        document.createElement("span");

    taskText.textContent =
        task.text;


    if (task.completed) {

        taskContent.classList.add(
            "completed"
        );

    }


    taskContent.appendChild(
        checkbox
    );

    taskContent.appendChild(
        taskText
    );


    // ==================== BUTTONS ====================

    const buttonContainer =
        document.createElement("div");

    buttonContainer.classList.add(
        "task-buttons"
    );


    // ==================== EDIT ====================

    const editButton =
        document.createElement("button");

    editButton.textContent =
        "Edit";

    editButton.classList.add(
        "edit-button"
    );


    // ==================== DELETE ====================

    const deleteButton =
        document.createElement("button");

    deleteButton.textContent =
        "Delete";

    deleteButton.classList.add(
        "delete-button"
    );


    buttonContainer.appendChild(
        editButton
    );

    buttonContainer.appendChild(
        deleteButton
    );


    taskItem.appendChild(
        taskContent
    );

    taskItem.appendChild(
        buttonContainer
    );

    taskList.appendChild(
        taskItem
    );


    // ==================== COMPLETE ====================

    checkbox.addEventListener(
        "change",
        function () {

            task.completed =
                checkbox.checked;

            saveTasks();

            renderTasks();

        }
    );


    // ==================== EDIT ====================

    editButton.addEventListener(
        "click",
        function () {

            startEditing(
                task,
                taskItem
            );

        }
    );


    // ==================== DELETE ====================

    deleteButton.addEventListener(
        "click",
        function () {

            tasks =
                tasks.filter(
                    function (item) {

                        return item.id !== task.id;

                    }
                );

            saveTasks();

            renderTasks();

        }
    );

}


// ==================== EDIT TASK ====================

function startEditing(
    task,
    taskItem
) {

    taskItem.innerHTML = "";


    const editInput =
        document.createElement("input");

    editInput.type = "text";

    editInput.value =
        task.text;

    editInput.classList.add(
        "edit-input"
    );


    const editButtons =
        document.createElement("div");

    editButtons.classList.add(
        "task-buttons"
    );


    const saveButton =
        document.createElement("button");

    saveButton.textContent =
        "Save";

    saveButton.classList.add(
        "save-button"
    );


    const cancelButton =
        document.createElement("button");

    cancelButton.textContent =
        "Cancel";

    cancelButton.classList.add(
        "cancel-button"
    );


    editButtons.appendChild(
        saveButton
    );

    editButtons.appendChild(
        cancelButton
    );


    taskItem.appendChild(
        editInput
    );

    taskItem.appendChild(
        editButtons
    );


    editInput.focus();

    editInput.select();


    // ==================== SAVE EDIT ====================

    saveButton.addEventListener(
        "click",
        function () {

            const newText =
                editInput.value.trim();


            if (newText === "") {

                alert(
                    "Task cannot be empty."
                );

                editInput.focus();

                return;

            }


            task.text =
                newText;

            saveTasks();

            renderTasks();

        }
    );


    // ==================== CANCEL EDIT ====================

    cancelButton.addEventListener(
        "click",
        function () {

            renderTasks();

        }
    );


    // ==================== KEYBOARD ====================

    editInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                saveButton.click();

            }


            if (event.key === "Escape") {

                cancelButton.click();

            }

        }
    );

}


// ==================== FILTER BUTTONS ====================

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.getAttribute(
                        "data-filter"
                    );


                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                renderTasks();

            }
        );

    }
);


// ==================== CLEAR COMPLETED ====================

clearCompletedButton.addEventListener(
    "click",
    function () {

        const completedTasks =
            tasks.filter(
                function (task) {

                    return task.completed;

                }
            );


        // No completed tasks

        if (completedTasks.length === 0) {

            alert(
                "There are no completed tasks."
            );

            return;

        }


        // Confirm deletion

        const confirmDelete =
            confirm(
                "Clear all completed tasks?"
            );


        if (!confirmDelete) {

            return;

        }


        // Remove completed tasks

        tasks =
            tasks.filter(
                function (task) {

                    return !task.completed;

                }
            );


        saveTasks();

        renderTasks();

    }
);


// ==================== TASK COUNT ====================

function updateTaskCount() {

    const remainingTasks =
        tasks.filter(
            function (task) {

                return !task.completed;

            }
        ).length;


    if (remainingTasks === 1) {

        taskCount.textContent =
            "1 task remaining";

    } else {

        taskCount.textContent =
            remainingTasks +
            " tasks remaining";

    }

}


// ==================== INITIAL DISPLAY ====================

renderTasks();