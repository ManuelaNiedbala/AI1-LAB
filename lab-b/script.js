document.todo = {
    tasks: [
        ["Zadanie", "2024-11-04"],
        ["Zadi", "2025-01-05"]
    ],
    searchQuery: '',
    editingIndex: null, 

    init: function () {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
        this.draw();
    },

    draw: function () {
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = '';

        const filteredTasks = this.tasks.filter(task => {
            return this.searchQuery.length < 2 || task[0].toLowerCase().includes(this.searchQuery.toLowerCase());
        });

        filteredTasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.setAttribute('data-index', index);

            if (this.editingIndex === index) {
                li.innerHTML = this.createEditTaskHtml(task);
            } else {
                li.innerHTML = this.createTaskHtml(task);
                li.onclick = (e) => this.editTask(e, index);
            }

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("button");
            deleteBtn.textContent = "Usuń";
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.removeTask(index);
            };
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });

        document.addEventListener('click', (e) => {
            if (this.editingIndex !== null) {
                const clickedElement = e.target.closest('li');
                if (!clickedElement || clickedElement.dataset.index != this.editingIndex) {
                    this.saveEdit(this.editingIndex);
                }
            }
        });
    },

createTaskHtml: function (task) {
    let taskName = task[0];
    
    // Podświetlanie wyszukiwanej frazy, jeśli `searchQuery` ma minimum 2 znaki
    if (this.searchQuery.length >= 2) {
        const regex = new RegExp(`(${this.searchQuery})`, 'gi');
        taskName = taskName.replace(regex, `<span class="highlight">$1</span>`);
    }

    return `
        <span class="task-name">${taskName}</span>
        <span class="task-date">${task[1] ? " " + task[1] : ""}</span>
    `;
},

    createEditTaskHtml: function (task) {
        return `
            <input type="text" value="${task[0]}" id="editTaskInput${this.editingIndex}" />
            <input type="date" value="${task[1] || ''}" id="editDateInput${this.editingIndex}" />
        `;
    },

    editTask: function (e, index) {
        e.stopPropagation(); 
        if (this.editingIndex !== null) {
            this.saveEdit(this.editingIndex); 
        }
        this.editingIndex = index;
        this.draw();

        setTimeout(() => {
            const editInput = document.getElementById(`editTaskInput${index}`);
            if (editInput) editInput.focus();
        }, 0);
    },

    saveEdit: function (index) {
        const editInput = document.getElementById(`editTaskInput${index}`);
        const editDateInput = document.getElementById(`editDateInput${index}`);

        if (editInput) {
            const updatedTaskName = editInput.value.trim();
            const updatedDate = editDateInput ? editDateInput.value : undefined;

            if (updatedTaskName.length < 3) {
                alert("Zadanie musi mieć co najmniej 3 znaki.");
                return;
            }

            if (updatedTaskName.length > 255) {
                alert("Zadanie nie może mieć więcej niż 255 znaków.");
                return;
            }

            const today = new Date().toISOString().split("T")[0];
            if (updatedDate && updatedDate < today) {
                alert("Data musi być pusta lub w przyszłości.");
                return;
            }

            this.tasks[index] = [updatedTaskName, updatedDate || undefined];
            this.saveTasks();
            this.editingIndex = null;
            this.draw();
        }
    },

    removeTask: function (index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.draw();
    },

    updateSearch: function (query) {
        this.searchQuery = query;
        this.draw();
    },

    saveTasks: function () {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
};

document.todo.init();

function addTask() {
    const taskInput = document.getElementById("taskInput").value.trim();
    const dateInput = document.getElementById("dateInput").value;

    if (taskInput.length < 3) {
        alert("Zadanie musi mieć co najmniej 3 znaki.");
        return;
    }

    if (taskInput.length > 255) {
        alert("Zadanie nie może mieć więcej niż 255 znaków.");
        return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (dateInput && dateInput < today) {
        alert("Data musi być pusta lub w przyszłości.");
        return;
    }

    document.todo.tasks.push([taskInput, dateInput || undefined]);
    document.todo.saveTasks();
    document.todo.draw();
    document.getElementById("taskInput").value = '';
    document.getElementById("dateInput").value = '';
}

function updateSearch() {
    const searchInput = document.getElementById("searchInput").value.trim();
    document.todo.updateSearch(searchInput);
}
