document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('#addTaskButton');
    const taskInput = document.querySelector('#taskInput');
    const firstColumn = document.querySelectorAll('.column')[0];

    addButton.addEventListener('click', function() {
        const taskContent = taskInput.value.trim();
        if (taskContent && firstColumn) {
            createTaskCard(taskContent, firstColumn);
            taskInput.value = '';
        } else {
            alert('Please enter a task description.');
        }
    });

    function createTaskCard(content, column) {
        const taskCard = document.createElement('div');
        taskCard.classList.add('flex', 'justify-between', 'items-center', 'task-card', 'bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'border', 'border-gray-300', 'hover:shadow-lg', 'transition-shadow', 'duration-200', 'ease-in-out', 'cursor-grab', 'mb-4');
        const taskId = `task-${Date.now()}`;
        taskCard.setAttribute('draggable', true);
        taskCard.id = taskId;
        
        taskCard.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData("text/plain", taskId);
        });

        const taskParagraph = document.createElement('p');
        taskParagraph.classList.add('text-sm', 'text-gray-700', 'cursor-pointer');
        taskParagraph.textContent = content;
    
        taskCard.appendChild(taskParagraph);

        const inputDiv = column.querySelector('#taskCreator');
        column.insertBefore(taskCard, inputDiv);

        taskParagraph.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = content;
            input.classList.add('text-sm', 'text-gray-700', 'cursor-pointer', 'w-full');
            taskCard.replaceChild(input, taskParagraph);
            input.focus();

            // Handle outside click
            input.addEventListener('blur', function() {
                taskParagraph.textContent = input.value;
                taskCard.replaceChild(taskParagraph, input);
            });

            // Optional: Handle Enter key press
            input.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    input.blur(); // Triggers the blur event
                }
            });
        });

        const deleteTask = document.createElement('button')
        deleteTask.innerHTML = "<i class='fas fa-trash-alt'></i>";
        deleteTask.classList.add("text-red-500", "hover:text-red-700")
        taskCard.appendChild(deleteTask);

        deleteTask.addEventListener("click", function(event) {
            const taskCard=event.target.closest('.task-card');
            taskCard.remove();
        })
    }

    const allColumns = document.querySelectorAll('.column');
    allColumns.forEach(column => {
        column.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        column.addEventListener('drop', (event) => {
            event.preventDefault();
            const data = event.dataTransfer.getData("text/plain");
            const draggedElement = document.getElementById(data);
            if (draggedElement) {
                const taskCreatorDiv = column.querySelector('#taskCreator');
                column.insertBefore(draggedElement, taskCreatorDiv);
            }
        });
    });
});
document.getElementById('save-tasks').addEventListener('click', function() {
    const tasks = [];
    document.querySelectorAll('.column').forEach((column, columnIndex) => {
        const status = column.getAttribute('data-status'); // Assuming each column has a 'data-status' attribute
        column.querySelectorAll('.task-card').forEach((card, cardIndex) => {
            const content = card.querySelector('p').textContent;
            tasks.push({ content, status, order: cardIndex, columnOrder: columnIndex });
        });
    });

    saveTasks(tasks);
});

function saveTasks(tasks) {
    fetch('/api/save-tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Tasks saved successfully');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to save tasks');
    });
}