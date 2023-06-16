document.getElementById('videoForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  var teamID = document.getElementById('teamID').value;
  var takeNumber = document.getElementById('takeNumber').value;
  
  var videoSource = '../Data/Videos/TID' + teamID + 'TN' + takeNumber + '.mp4';
  
  var videoPlayer = document.getElementById('videoPlayer');
  videoPlayer.innerHTML = '<video controls><source src="' + videoSource + '" type="video/mp4"></video>';
  
  // Fetch and display the CSV table
  fetch('../Data/educator_data.csv')
      .then(response => response.text())
      .then(data => {
          var table = document.getElementById('educatorTable');
          var rows = data.split('\n');
          rows.forEach((row, rowIndex) => {
              var rowData = row.split(',');
              var tableRow = document.createElement('tr');
              rowData.forEach((cellData, index) => {
                  var tableCell = document.createElement('td');
                  if (index === 2 && cellData === '1') {
                      var redRectangle = document.createElement('div');
                      redRectangle.classList.add('color-rectangle', 'red');
                      tableCell.appendChild(redRectangle);
                  } else if (index === 2 && cellData === '3') {
                      var yellowRectangle = document.createElement('div');
                      yellowRectangle.classList.add('color-rectangle', 'yellow');
                      tableCell.appendChild(yellowRectangle);
                  } else if (index === 2 && cellData === '5') {
                      var greenRectangle = document.createElement('div');
                      greenRectangle.classList.add('color-rectangle', 'green');
                      tableCell.appendChild(greenRectangle);
                  } else if (index === 3) {
                      var timestampLink = document.createElement('a');
                      timestampLink.href = '#';
                      timestampLink.textContent = cellData;
                      timestampLink.addEventListener('click', function() {
                          jumpToTimestamp(cellData);
                      });
                      tableCell.appendChild(timestampLink);
                  } else if (index === 6 && rowIndex > 0) {
                      var reflectionInput = document.createElement('input');
                      reflectionInput.type = 'text';
                      reflectionInput.classList.add('reflection-input');
                      reflectionInput.addEventListener('input', function() {
                          updateReflection(rowIndex, this.value);
                      });
                      tableCell.appendChild(reflectionInput);
                  } else {
                      tableCell.textContent = cellData;
                  }
                  tableRow.appendChild(tableCell);
              });
              table.appendChild(tableRow);
          });
      });
});

function jumpToTimestamp(timestamp) {
  // Extract hours, minutes, and seconds from the timestamp
  var [hours, minutes, seconds] = timestamp.split(':');

  // Calculate the total number of seconds
  var totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

  // Seek to the specified timestamp in the video
  var video = document.querySelector('#videoPlayer video');
  video.currentTime = totalSeconds;
}

function updateReflection(rowIndex, reflection) {
  var table = document.getElementById('educatorTable');
  var row = table.rows[rowIndex];
  var reflectionCell = row.cells[6];
  reflectionCell.textContent = reflection;
}
