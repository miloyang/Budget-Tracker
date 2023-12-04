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

document.addEventListener('DOMContentLoaded', async () => {
    const tasksContainer = document.getElementById('tasksContainer');
    
    // Fetch the saved tasks when the page is loaded
    try {
      const response = await fetch('/api/tasks');
    
      if (response.ok) {
        const tasks = await response.json();
        console.log('Tasks retrieved successfully:', tasks);
    
        // Update UI with the retrieved tasks
        renderTasks(tasks, tasksContainer);
      } else {
        console.error('Failed to retrieve tasks:', response.statusText);
      }
    } catch (error) {
      console.error('Error retrieving tasks:', error.message);
    }

    const saveTasksButton = document.getElementById('save-tasks');
  
    saveTasksButton.addEventListener('click', async () => {
      try {
        // Create an array of tasks
        const tasks = [
            { name: 'Task 1', column: 'new'},
            { name: 'Task 2', column: 'urgent'},
            { name: 'Task 3', column: 'in-progress'},
            { name: 'Task 4', column: 'completed'},
        ]
        // Make a fetch request to your server's API endpoint for creating tasks
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Sending an array of tasks to the server
          body: JSON.stringify({ tasks }),
        });
  
        if (response.ok) {
            const result = await response.json();
            console.log('Tasks saved successfully:', result);
      
            // Fetch the updated tasks after saving
            const updatedResponse = await fetch('/api/tasks');
      
            if (updatedResponse.ok) {
              const updatedTasks = await updatedResponse.json();
              console.log('Updated tasks retrieved successfully:', updatedTasks);
      
              // Update UI with the retrieved tasks
              renderTasks(updatedTasks, tasksContainer);
            } else {
              console.error('Failed to retrieve updated tasks:', updatedResponse.statusText);
            }
          } else {
            console.error('Failed to save tasks:', response.statusText);
          }
        } catch (error) {
          console.error('Error saving tasks:', error.message);
        }
      });
    });
    
    // Function to render tasks on the page
    function renderTasks(tasks, container) {
      // Clear the existing content in the container
      container.innerHTML = '';
    
      // Iterate through the tasks and append them to the container
      tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.textContent = task.id; 
        container.appendChild(taskElement);
      });
    }