document.getElementById('taskForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  // Get the task input value
  var taskInput = document.getElementById('taskInput');
  var task = taskInput.value;

  // Create a new row for the table
  var newRow = document.createElement('tr');

  // Create a cell for the task
  var taskCell = document.createElement('td');
  taskCell.textContent = task;
  newRow.appendChild(taskCell);

  // Create a cell for the delete button
  var deleteCell = document.createElement('td');
  var deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', function() {
    newRow.remove(); // Remove the row when delete button is clicked
  });
  deleteCell.appendChild(deleteButton);
  newRow.appendChild(deleteCell);

  // Add the new row to the table
  var taskList = document.getElementById('taskList');
  taskList.appendChild(newRow);

  // Clear the task input
  taskInput.value = '';

  // Initialize sortable
  Sortable.create(taskList, {
    animation: 150,
    handle: 'td',
    onUpdate: function(event) {
      // Update the order of the rows after sorting
      var rows = taskList.getElementsByTagName('tr');
    }
  });
});

document.getElementById('exportButton').addEventListener('click', function() {
  // Get the tasks from the table
  var taskRows = document.getElementById('taskList').getElementsByTagName('tr');
  var tasks = [];
  for (var i = 0; i < taskRows.length; i++) {
    var task = taskRows[i].getElementsByTagName('td')[0].textContent;
    tasks.push(task);
  }

  // Encode tasks as a URL parameter
  var encodedTasks = encodeURIComponent(tasks.join(','));

  // Redirect to the new page with the tasks as a URL parameter
  window.location.href = '../DataAssist/index.html?tasks=' + encodedTasks;
});
