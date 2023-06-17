document.addEventListener('DOMContentLoaded', function() {
  var videoContainer = document.getElementById('videoContainer');
  var teamIDInput = document.getElementById('teamID');
  var takeNumberInput = document.getElementById('takeNumber');
  var findVideoButton = document.getElementById('findVideoButton');
  var uploadedVideo = document.getElementById('uploadedVideo');
  var exportedTaskTable = document.getElementById('exportedTaskTable');
  var selectedTaskTable = document.getElementById('selectedTaskTable');
  var exportButton = document.getElementById('exportButton');
  var videoTimestamp = 0;
  var teamID = '';
  var takeNumber = '';

  findVideoButton.addEventListener('click', function() {
    teamID = teamIDInput.value;
    takeNumber = takeNumberInput.value;
    var videoPath = '../Data/Videos/TID' + teamID + 'TN' + takeNumber + '.mp4';
    uploadedVideo.src = videoPath;
    uploadedVideo.load();

    var exportedTableRows = exportedTaskTable.getElementsByTagName('tr');
    var rowCount = exportedTableRows.length;

    for (var i = 1; i < rowCount; i++) {
      var teamIDCell = document.createElement('td');
      teamIDCell.textContent = teamID;
      exportedTableRows[i].appendChild(teamIDCell);

      var takeNumberCell = document.createElement('td');
      takeNumberCell.textContent = takeNumber;
      exportedTableRows[i].appendChild(takeNumberCell);
    }
  });

  uploadedVideo.addEventListener('timeupdate', function() {
    videoTimestamp = Math.floor(uploadedVideo.currentTime);
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
    timestampCell.textContent = formatTimestamp(videoTimestamp);
    newRow.appendChild(timestampCell);

    var teamIDCell = document.createElement('td');
    teamIDCell.textContent = teamID;
    newRow.appendChild(teamIDCell);

    var takeNumberCell = document.createElement('td');
    takeNumberCell.textContent = takeNumber;
    newRow.appendChild(takeNumberCell);

    selectedTaskTable.appendChild(newRow);
  }

  function formatTimestamp(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    var timestamp = date.toISOString().substr(11, 8);
    return timestamp;
  }

  var urlParams = new URLSearchParams(window.location.search);
  var teamIDParam = urlParams.get('teamID');
  var takeNumberParam = urlParams.get('takeNumber');
  var tasksParam = urlParams.get('tasks');
  var tasks = tasksParam ? tasksParam.split(',') : [];

  if (teamIDParam && takeNumberParam) {
    teamIDInput.value = teamIDParam;
    takeNumberInput.value = takeNumberParam;
    findVideoButton.click();
  }

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

    var greenCell = document.createElement('td');
    var greenButton = document.createElement('button');
    greenButton.textContent = 'Green';
    greenButton.classList.add('green');
    greenButton.dataset.taskIndex = i;
    greenButton.addEventListener('click', addToSelectedTable);
    greenCell.appendChild(greenButton);
    newRow.appendChild(greenCell);

    var yellowCell = document.createElement('td');
    var yellowButton = document.createElement('button');
    yellowButton.textContent = 'Yellow';
    yellowButton.classList.add('yellow');
    yellowButton.dataset.taskIndex = i;
    yellowButton.addEventListener('click', addToSelectedTable);
    yellowCell.appendChild(yellowButton);
    newRow.appendChild(yellowCell);

    var redCell = document.createElement('td');
    var redButton = document.createElement('button');
    redButton.textContent = 'Red';
    redButton.classList.add('red');
    redButton.dataset.taskIndex = i;
    redButton.addEventListener('click', addToSelectedTable);
    redCell.appendChild(redButton);
    newRow.appendChild(redCell);

    exportedTaskTable.appendChild(newRow);
  }

  exportButton.addEventListener('click', function() {
    var selectedRows = selectedTaskTable.getElementsByTagName('tr');
    var rowCount = selectedRows.length;

    var csvContent = 'Task,Feedback,Color,Timestamp,Team ID,Take Number\r\n';

    for (var i = 1; i < rowCount; i++) {
      var rowData = Array.from(selectedRows[i].querySelectorAll('td')).map(function(column) {
        return column.textContent;
      });

      // Exclude empty rows
      if (rowData.some(function(data) {
        return data.trim() !== '';
      })) {
        csvContent += rowData.join(',') + "\r\n";
      }
    }

    // Send the CSV content to the server for saving
    saveCSVFile(csvContent);

    // Flash feedback saved message
    var feedbackSavedMessage = document.createElement('div');
    feedbackSavedMessage.textContent = 'Feedback saved';
    feedbackSavedMessage.classList.add('feedback-saved-message');
    document.body.appendChild(feedbackSavedMessage);

    // Refresh the page after 2 seconds
    setTimeout(function() {
      location.reload();
    }, 2000);
  });
  
  // Function to send the CSV data to the server
  function saveCSVFile(csvContent) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'save_csv.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // File saved successfully
        console.log('CSV file saved on the server');
      }
    };
    xhr.send('csvContent=' + encodeURIComponent(csvContent));
  }
  
});
