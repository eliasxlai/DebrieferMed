const taskForm = document.querySelector("#new-task-form");
  const taskInput = document.querySelector("#new-task-input");
  const taskList = document.querySelector("#tasks");
  const taskTable = document.querySelector("#task-table");

  taskForm.addEventListener("submit", e => {
    e.preventDefault();

    // get the task name
    const taskName = taskInput.value;

    // create the task element
    const taskEl = document.createElement("div");
    taskEl.classList.add("task");
    taskEl.innerHTML = `
      <div class="content">
        <span class="text">${taskName}</span>
      </div>
      <div class="actions">

	<button class="btn btn-success">Green</button>
    <button class="btn btn-warning">Yellow</button>
    <button class="btn btn-danger">Red</button>
      </div>
    `;

    // add event listeners to the buttons
    taskEl.querySelector(".btn-success").addEventListener("click", () => addTaskToTable(taskName, "green"));
    taskEl.querySelector(".btn-warning").addEventListener("click", () => addTaskToTable(taskName, "yellow"));
    taskEl.querySelector(".btn-danger").addEventListener("click", () => addTaskToTable(taskName, "red"));

    // append the task element to the task list
    taskList.appendChild(taskEl);

    // reset the form
    taskForm.reset();
  });

  function addTaskToTable(taskName, color) {
    // get the current date and time
    const dateTime = new Date().toLocaleString();

    // create a new row in the table
    const newRow = taskTable.insertRow();

    // insert cells in the row
    const taskNameCell = newRow.insertCell(0);
    const colorCell = newRow.insertCell(1);
    const dateTimeCell = newRow.insertCell(2);

    // fill the cells with data
    taskNameCell.innerHTML = taskName;
    colorCell.innerHTML = color;
    dateTimeCell.innerHTML = dateTime;
  }