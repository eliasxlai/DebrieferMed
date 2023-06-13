document.addEventListener('DOMContentLoaded', function() {
  var videoInput = document.getElementById('videoInput');
  var uploadedVideo = document.getElementById('uploadedVideo');
  var dropArea = document.getElementById('dropArea');
  var exportedTaskTable = document.getElementById('exportedTaskTable');
  var selectedTaskTable = document.getElementById('selectedTaskTable');
  var exportButton = document.getElementById('exportButton');

  var videoTimestamp = null;

  function handleFile(file) {
    var videoURL = URL.createObjectURL(file);
    uploadedVideo.src = videoURL;
  }

  dropArea.addEventListener('dragover', function(event) {
    event.preventDefault();
    dropArea.classList.add('drag-over');
  });

  dropArea.addEventListener('dragleave', function(event) {
    event.preventDefault();
    dropArea.classList.remove('drag-over');
  });

  dropArea.addEventListener('drop', function(event) {
    event.preventDefault();
    dropArea.classList.remove('drag-over');
    var file = event.dataTransfer.files[0];
    handleFile(file);
  });

  videoInput.addEventListener('change', function(event) {
    var file = event.target.files[0];
    handleFile(file);
  });

  uploadedVideo.addEventListener('timeupdate', function() {
    videoTimestamp = Math.floor(uploadedVideo.currentTime);
  });

  function addToSelectedTable(event) {
    var taskIndex = event.target.dataset.taskIndex;
    var task = tasks[taskIndex];
    var feedback = event.target.parentNode.parentNode.querySelector('input').value;
    var color = event.target.dataset.color;

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
    timestampCell.textContent = formatTimestamp(videoTimestamp);
    newRow.appendChild(timestampCell);

    selectedTaskTable.appendChild(newRow);
  }

  function formatTimestamp(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    var timestamp = date.toISOString().substr(11, 8);
    return timestamp;
  }

  var urlParams = new URLSearchParams(window.location.search);
  var tasksParam = urlParams.get('tasks');
  var tasks = decodeURIComponent(tasksParam).split(',');

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
    greenButton.dataset.color = 'green';
    greenButton.addEventListener('click', addToSelectedTable);
    colorCell.appendChild(greenButton);

    var yellowButton = document.createElement('button');
    yellowButton.className = 'yellow';
    yellowButton.dataset.taskIndex = i;
    yellowButton.dataset.color = 'yellow';
    yellowButton.addEventListener('click', addToSelectedTable);
    colorCell.appendChild(yellowButton);

    var redButton = document.createElement('button');
    redButton.className = 'red';
    redButton.dataset.taskIndex = i;
    redButton.dataset.color = 'red';
    redButton.addEventListener('click', addToSelectedTable);
    colorCell.appendChild(redButton);

    newRow.appendChild(colorCell);

    exportedTaskTable.appendChild(newRow);
  }

  function exportToCSV() {
  var csvContent = "data:text/csv;charset=utf-8,";

  // Header row
  var headers = Array.from(document.querySelectorAll("#selectedTaskTable th")).map(function (header) {
    return header.textContent;
  });
  csvContent += headers.join(",") + "\n";

  // Data rows
  var rows = Array.from(document.querySelectorAll("#selectedTaskTable tbody tr")).map(function (row) {
    return Array.from(row.querySelectorAll("td")).map(function (cell) {
      return cell.textContent;
    }).join(",");
  });
  csvContent += rows.join("\n");

  // Create a temporary link and download the CSV file
  var link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "feedback_summary.csv";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

var exportButton = document.getElementById("exportButton");
exportButton.addEventListener("click", exportToCSV);

var exportButton = document.getElementById("exportButton");
exportButton.addEventListener("click", exportToCSV);
});
