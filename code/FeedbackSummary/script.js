document.addEventListener('DOMContentLoaded', function() {
  var feedbackSummaryTable = document.getElementById('feedbackSummaryTable');

  var urlParams = new URLSearchParams(window.location.search);
  var selectedTasksParam = urlParams.get('selectedTasks');
  var selectedTasks = JSON.parse(decodeURIComponent(selectedTasksParam));

  for (var i = 0; i < selectedTasks.length; i++) {
    var task = selectedTasks[i].task;
    var feedback = selectedTasks[i].feedback;
    var color = selectedTasks[i].color;
    var timestamp = selectedTasks[i].timestamp;

    var newRow = document.createElement('tr');

    var taskCell = document.createElement('td');
    taskCell.textContent = task;
    newRow.appendChild(taskCell);

    var feedbackCell = document.createElement('td');
    feedbackCell.textContent = feedback;
    newRow.appendChild(feedbackCell);

    var colorCell = document.createElement('td');
    var colorButton = document.createElement('button');
    colorButton.className = color;
    colorCell.appendChild(colorButton);
    newRow.appendChild(colorCell);

    var timestampCell = document.createElement('td');
    timestampCell.textContent = timestamp;
    newRow.appendChild(timestampCell);

    feedbackSummaryTable.appendChild(newRow);
  }
});
