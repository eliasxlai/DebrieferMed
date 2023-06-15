document.addEventListener('DOMContentLoaded', function() {
  var videoContainer = document.getElementById('videoContainer');
  var teamIDInput = document.getElementById('teamIDInput');
  var takeNumberInput = document.getElementById('takeNumberInput');
  var videoButton = document.getElementById('videoButton');
  var uploadedVideo = document.getElementById('uploadedVideo');
  var exportedTaskTable = document.getElementById('exportedTaskTable');
  var selectedTaskTable = document.getElementById('selectedTaskTable');
  var exportButton = document.getElementById('exportButton');

  var videoPath = '';

  videoButton.addEventListener('click', function() {
    var teamID = teamIDInput.value;
    var takeNumber = takeNumberInput.value;

    if (teamID && takeNumber) {
      videoPath = '../Data/Videos/TID' + teamID + 'TN' + takeNumber + '.mp4';
      uploadedVideo.src = videoPath;
    }
  });

  uploadedVideo.addEventListener('timeupdate', function() {
    var videoTimestamp = Math.floor(uploadedVideo.currentTime);
    var timestampCell = document.getElementById('videoTimestamp');
    if (timestampCell) {
      timestampCell.textContent = formatTimestamp(videoTimestamp);
    }
  });

  function addToSelectedTable(event) {
    var taskIndex = event.target.dataset.taskIndex;
    var task = tasks[taskIndex];
    var feedback = event.target.parentNode.parentNode.querySelector('input').value;
    var color = '';

    if (event.target.classList.contains('green')) {
      color = '5';
    } else if (event.target.classList.contains('yellow')) {
      color = '3';
    } else if (event.target.classList.contains('red')) {
      color = '1';
    }

    var newRow = document.createElement('tr');

    var taskCell = document.createElement('td');
    taskCell.textContent = task;
    newRow.appendChild(taskCell);

    var feedbackCell = document.createElement('td');
    feedbackCell.textContent = feedback;
    newRow.appendChild(feedbackCell);

    var colorCell = document.createElement('td');
    colorCell.textContent = color;
    newRow.appendChild(colorCell);

    var timestampCell = document.createElement('td');
    timestampCell.textContent = formatTimestamp(uploadedVideo.currentTime);
    newRow.appendChild(timestampCell);

    selectedTaskTable.appendChild(newRow);
  }

  function formatTimestamp(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    var timestamp = date.toISOString().substr(11, 8);
    return timestamp;
  }

  var tasks = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];

  for (var i = 0; i < tasks.length; i++) {
    var newRow = document.createElement('tr');

    var taskCell = document.createElement('td');
    taskCell.textContent = tasks[i];
    newRow.appendChild(taskCell);

    var feedbackCell = document.createElement('td');
    var feedbackInput = document.createElement('input');
    feedbackInput.type = 'text';
    feedbackCell.appendChild(feedbackInput);
    newRow.appendChild(feedbackCell);

    var colorCell = document.createElement('td');
    var greenButton = document.createElement('button');
    greenButton.className = 'green';
    greenButton.dataset.taskIndex = i;
    greenButton.addEventListener('click', addToSelectedTable);
    colorCell.appendChild(greenButton);
    var yellowButton = document.createElement('button');
    yellowButton.className = 'yellow';
    yellowButton.dataset.taskIndex = i;
    yellowButton.addEventListener('click', addToSelectedTable);
    colorCell.appendChild(yellowButton);
    var redButton = document.createElement('button');
    redButton.className = 'red';
    redButton.dataset.taskIndex = i;
    redButton.addEventListener('click', addToSelectedTable);
    colorCell.appendChild(redButton);
    newRow.appendChild(colorCell);

    exportedTaskTable.appendChild(newRow);
  }

  exportButton.addEventListener('click', function() {
    var csvContent = 'data:text/csv;charset=utf-8,';

    var columnNames = ['Task', 'Feedback', 'Color', 'Timestamp'];
    csvContent += columnNames.join(',') + "\r\n";

    var rows = selectedTaskTable.querySelectorAll('tr');
    Array.prototype.forEach.call(rows, function(row) {
      var rowData = Array.from(row.cells).map(function(column) {
        return column.textContent;
      });

      // Exclude empty rows
      if (rowData.some(function(data) {
        return data.trim() !== '';
      })) {
        csvContent += rowData.join(',') + "\r\n";
      }
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'feedback_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
