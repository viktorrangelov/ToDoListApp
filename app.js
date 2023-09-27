document.addEventListener('DOMContentLoaded', () => {
    const addButtonElement = document.getElementById('add');
    const taskInputElement = document.getElementById('task');
    const descriptionTextAreaElement = document.getElementById('description');
    const openTasksElement = document.getElementById('open');
    const taskEditInputElement = document.getElementById('editTask');
    const descriptionInputElement = document.getElementById('editDescription');
    const finishedTasks = document.getElementById('completed');
    const purgeCache = document.getElementById('clear');

    purgeCache.addEventListener("click", ()=>{
        localStorage.clear();
        location.reload();
        
    })

    // Load tasks from local storage when the page loads
    loadTasks();

    addButtonElement.addEventListener('click', addButtonClickHandler);

    function addButtonClickHandler(event1) {
        event1.preventDefault();
        let taskValue = taskInputElement.value;
        let descriptionValue = descriptionTextAreaElement.value;

        addButtonElement.textContent = 'Add';
        document.getElementById('todo').textContent = 'ToDo';

        if (taskValue != '' && descriptionValue != '') {

            createTaskAndAddToOpenTasks(taskValue, descriptionValue);
            taskInputElement.value = '';
            descriptionTextAreaElement.value = '';

        } else {

            alert('Task or description field is empty')
        }
    }

    function createTaskAndAddToOpenTasks(taskValue, descriptionValue) {
        // Creating the elements for the open task
        let newTask = document.createElement("article");
        let newDiv = document.createElement("div");
        newDiv.classList.add('flex');
        let newTitle = document.createElement("h3");
        let newDescription = document.createElement("p");
        let editBtn = document.createElement("button");
        editBtn.textContent = 'Edit';
        editBtn.classList.add('yellow');
        let completeBtn = document.createElement("button");
        completeBtn.textContent = 'Complete';
        completeBtn.classList.add('orange');
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('red');

        // Give content to the elements
        newTitle.textContent = taskValue;
        newDescription.textContent = descriptionValue;

        // Completing the whole element
        newDiv.appendChild(editBtn);
        newDiv.appendChild(completeBtn);
        newDiv.appendChild(deleteBtn);
        newTask.appendChild(newTitle);
        newTask.appendChild(newDescription);
        newTask.appendChild(newDiv);

        // Put the task to the openTasks section
        openTasksElement.appendChild(newTask);

        //edit function

        editBtn.addEventListener("click", (event2) => {
            let parentContainer = event2.target.parentNode.parentNode;


            addButtonElement.classList.add('hide');
            const updateBtn = document.getElementById('update');
            updateBtn.classList.remove('hide');
            document.getElementById('todo').textContent = 'Edit Task';

            let h3Element = parentContainer.firstChild;


            let pElement = parentContainer.children[1];


            taskInputElement.classList.add('hide');
            descriptionTextAreaElement.classList.add('hide');
            taskEditInputElement.classList.remove('hide');
            descriptionInputElement.classList.remove('hide');
            taskEditInputElement.value = h3Element.textContent;
            descriptionInputElement.value = pElement.textContent;

            function updateHandler(e) {
                e.preventDefault();

                let newH3Element = document.createElement("h3");
                newH3Element.textContent = descriptionInputElement.value;
                let newPElement = document.createElement("p");
                newPElement.textContent = taskEditInputElement.value;

                parentContainer.innerHTML = '';
                parentContainer.appendChild(newH3Element);
                parentContainer.appendChild(newPElement);
                parentContainer.appendChild(newDiv);

                taskValue = h3Element.textContent;
                descriptionValue = descriptionInputElement.value;

                addButtonElement.classList.remove('hide');
                updateBtn.classList.add('hide');
                taskEditInputElement.classList.add('hide');
                descriptionInputElement.classList.add('hide');
                taskInputElement.classList.remove('hide');
                descriptionTextAreaElement.classList.remove('hide');
                document.getElementById('todo').textContent = 'ToDo';


                updateBtn.removeEventListener("click", updateHandler);



                saveTasksInOpenToLocalStorage()

            }

            updateBtn.addEventListener("click", updateHandler);
        });


        completeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            completeTask(taskValue, descriptionValue);
            e.target.parentNode.parentNode.remove();
            saveTasksInOpenToLocalStorage();
        });




        deleteBtn.addEventListener("click", (event4) => {

            event4.target.parentNode.parentNode.remove();


            saveTasksInOpenToLocalStorage()
        })


        // Save the task data in local storage
        saveTasksInOpenToLocalStorage()

    }

    function completeTask(taskValue, descriptionValue) {
        // Creating elements
        let completedTask = document.createElement("article");
        let completedDiv = document.createElement("div");
        completedDiv.classList.add('flex');
        let completedTitle = document.createElement("h3");
        completedTitle.textContent = taskValue;
        let completedDescription = document.createElement("p");
        completedDescription.textContent = descriptionValue;

        // Completing the element
        completedTask.appendChild(completedTitle);
        completedTask.appendChild(completedDescription);

        finishedTasks.appendChild(completedTask);


        saveTasksInCompletedLocalStorage();

    }



    function saveTasksInOpenToLocalStorage() {
        let tasks = [];

        // Loop through the child elements of openTasksElement
        let taskElements = openTasksElement.querySelectorAll("article");
        taskElements.forEach((taskElement) => {
            let h3Element = taskElement.querySelector("h3");
            let pElement = taskElement.querySelector("p");

            if (h3Element && pElement) {
                let taskValue = h3Element.textContent;
                let descriptionValue = pElement.textContent;

                tasks.push({
                    taskValue,
                    descriptionValue,
                });
            }
        });

        // Save the tasks data in local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function saveTasksInCompletedLocalStorage() {
        let completedTasks = [];
        let completedTaskElements = finishedTasks.querySelectorAll("article");
        completedTaskElements.forEach((taskElement) => {
            let h3Element = taskElement.querySelector("h3");
            let pElement = taskElement.querySelector("p");

            if (h3Element && pElement) {
                let taskValue = h3Element.textContent;
                let descriptionValue = pElement.textContent;

                completedTasks.push({
                    taskValue,
                    descriptionValue,
                });
            }
        });

        // Save the completed tasks data in local storage
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }

    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach((task) => {
            // Call the createTaskAndAddToOpenTasks function with saved values
            createTaskAndAddToOpenTasks(task.taskValue, task.descriptionValue);
        });

        let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

        completedTasks.forEach((completedTask) => {

            completeTask(completedTask.taskValue, completedTask.descriptionValue);
        });
    }
});