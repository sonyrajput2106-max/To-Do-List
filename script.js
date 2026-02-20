document.addEventListener('DOMContentLoaded', () => {

    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');

    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    const progressMessage = document.getElementById('progress-message');


    // Toggle Empty Image
    function toggleEmptyState() {
        if (taskList.children.length === 0) {
            emptyImage.style.display = "block";
        } else {
            emptyImage.style.display = "none";
        }
    }

    // Update Progress Bar
    function updateProgress() {
        const totalTasks = document.querySelectorAll('#task-list li').length;
        const completedTasks = document.querySelectorAll('#task-list li.completed').length;

        progressText.textContent = `${completedTasks} / ${totalTasks}`;

        const percentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        progressFill.style.width = percentage + "%";

    }


    // Save To LocalStorage
    function saveToLocalStorage() {
        const tasks = [];

        document.querySelectorAll('#task-list li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }


    // Load From LocalStorage
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

        storedTasks.forEach(task => {
            addTask(task.text, task.completed);
        });

        toggleEmptyState();
        updateProgress();
    }

    // Add Task (Create)
    function addTask(text = null, completed = false) {

        const taskText = text || taskInput.value.trim();
        if (!taskText) return;

        const li = document.createElement('li');

        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
        }


        // Complete Task (Update)
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed', checkbox.checked);
            editBtn.disabled = checkbox.checked;

            saveToLocalStorage();
            updateProgress();
        });


        // Edit Task (Update)
        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();

                saveToLocalStorage();
                toggleEmptyState();
                updateProgress();
            }
        });


        // Delete Task (Delete)
        deleteBtn.addEventListener('click', () => {
            li.remove();

            saveToLocalStorage();
            toggleEmptyState();
            updateProgress();
        });

        taskList.appendChild(li);
        taskInput.value = "";

        saveToLocalStorage();
        toggleEmptyState();
        updateProgress();
    }

    // Event Listeners
    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });


    // Initial Load

    loadTasks();

});