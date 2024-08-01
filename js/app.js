const tasks = [];
const input = document.getElementById("todo-input");
const priority = document.getElementById("priority-select");
// const submitButton = document.getElementById("submit");


document.getElementById("todo-input").addEventListener("input", () => {
  const submitButton = document.getElementById("submit");
  if (input.value.trim() === "") { //if input empty => disable btn 
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
});

// local storage tasks
window.onload = function () {
  const savedTasks = localStorage.getItem("tasks"); // get string stored in array

  if (savedTasks) {
    tasks.push(...JSON.parse(savedTasks)); // string->array + (...) makes every elemet on a line & (enumerated)
  }

  renderList(); // display
};

document.getElementById("todo-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const input = document.getElementById("todo-input").value;
  const priority = document.getElementById("priority-select").value;
  if (input && priority) { //if not null
    tasks.push({ name: input, importance: priority, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderList();
    document.getElementById("todo-input").value = "";
  
    // document.getElementById("priority-select").value = "";
  }
});


document.getElementById("search-input").addEventListener("input", function () {
  renderList();
});

document.getElementById("filter-select").addEventListener("change", function () {
  renderList();
});

function renderList() {
  // create list
  const ul = document.getElementById("todo-list");
  ul.innerHTML = ""; // empty list

  const input = document.getElementById("todo-input");
  const priority = document.getElementById("priority-select");

  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const filterPriority = document.getElementById("filter-select").value.toLowerCase();

  tasks
    .filter((task) => {
      const matchesSearch = searchTerm === "" || task.name.toLowerCase().includes(searchTerm);
      const matchesPriority = filterPriority === "" || task.importance.toLowerCase() === filterPriority;
      return matchesSearch && matchesPriority;
    })
    .forEach((task, index) => {
      // create element li
      const li = document.createElement("li");
      li.textContent = `${task.name} | Priority ${task.importance}`;
      if (task.completed) {
        li.style.textDecoration = "line-through"; // completed task line-through
      }
      ul.appendChild(li);

      // create checkbox
      const checkbox = document.createElement("input");
      checkbox.setAttribute('type', 'checkbox');
      checkbox.checked = task.completed; 
      li.appendChild(checkbox);

      // create delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      li.appendChild(deleteButton);

      // event listener for delete
      deleteButton.addEventListener("click", () => delTask(index));

      // event listener for checkbox
      checkbox.addEventListener("change", function () {
        task.completed = checkbox.checked; //if task completed => checkbox checked true
        localStorage.setItem("tasks", JSON.stringify(tasks)); // save in local storage
         if(checkbox.checked) 
           li.style.textDecoration = "line-through";
          else  li.style.textDecoration = "none";
      });

      // create update button
      const updateButton = document.createElement("button");
      updateButton.textContent = "Update";
      li.appendChild(updateButton);
      updateButton.setAttribute('id', 'updateButton');

      // event listener to update
      updateButton.addEventListener("click", () => editTask(index));
    });
}

function delTask(index) {
  tasks.splice(index, 1); // delete from array
  localStorage.setItem("tasks", JSON.stringify(tasks)); // array=>string + store it
  renderList(); //re-display updated list
}

function editTask(index) {
  const task = tasks[index];
  document.getElementById("todo-input").value = task.name;
  document.getElementById("priority-select").value = task.importance;

  const form = document.getElementById("todo-form");
  const submitButton = document.getElementById("submit");
  submitButton.style.display = "none"; // be5fe the add todo

  //error : btn save created multiple times so if exists => delete it la ydal 1 save btn
  const existingSaveButton = document.getElementById("saveButton");
  if (existingSaveButton) {
    form.removeChild(existingSaveButton);
  }

  const saveButton = document.createElement("button"); // new button
  saveButton.textContent = "Save";
  saveButton.setAttribute("id", "saveButton");
  form.appendChild(saveButton);

  saveButton.addEventListener("click", function (event) {
    event.preventDefault(); // to keep result shown
    tasks[index].name = document.getElementById('todo-input').value;
    tasks[index].importance = document.getElementById('priority-select').value;

    localStorage.setItem("tasks", JSON.stringify(tasks)); // nghayer l value in local storage
    document.getElementById("todo-input").value = "";
    // document.getElementById("priority-select").value = "";
    form.removeChild(saveButton); // Remove save button mnel form
    submitButton.style.display = "inline"; // Show add btn
    renderList();
  });
}
//note : disable btn if input is empty 
//note : fix overflow => scroll
//note : fix edit 

