document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('videoForm');
  const teamIdInput = document.getElementById('teamId');
  const takeNumberInput = document.getElementById('takeNumber');
  const videoPlayer = document.getElementById('videoPlayer');
  const educatorTable = document.getElementById('educatorTable');

  form.addEventListener('submit', function(e) {
      e.preventDefault();

      const teamId = Number(teamIdInput.value);
      const takeNumber = Number(takeNumberInput.value);
      const videoPath = `../Data/Videos/TID${teamId}TN${takeNumber}.mp4`;

      videoPlayer.innerHTML = `
          <video controls>
              <source src="${videoPath}" type="video/mp4">
          </video>
      `;

      loadEducatorData(teamId, takeNumber);
  });

  function loadEducatorData(teamId, takeNumber) {
    const csvPath = '../Data/student_data.csv';

    fetch(csvPath)
        .then(response => response.text())
        .then(csvData => {
            const rows = csvData.split('\n');
            const tableHeaders = rows[0].split(',');
            const tableBody = document.createElement('tbody');

            // Create table header row
            const tableHeaderRow = document.createElement('tr');
            tableHeaders.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                tableHeaderRow.appendChild(th);
            });

            tableBody.appendChild(tableHeaderRow);

            // Create table rows
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].split(',');
                const rowData = row.slice(0, 7); // Get the first 7 columns from the CSV

                if (rowData[4] == teamId && rowData[5] == takeNumber) {
                    const tableRow = document.createElement('tr');

                    rowData.forEach((data, index) => {
                        const td = document.createElement('td');
                        if (index === 3) {
                          // Create hyperlink with timestamp
                            const timestamp = rowData[3];
                            const hyperlink = document.createElement('a');
                            hyperlink.href = '#'; // Replace '#' with the appropriate video timestamp
                            hyperlink.textContent = timestamp;
                            hyperlink.addEventListener('click', function() {
                              jumpToTimestamp(rowData[3]);
                          });
                            td.appendChild(hyperlink);
                        } else {
                            td.innerHTML = data;
                        }
                        tableRow.appendChild(td);
                    });

                    tableBody.appendChild(tableRow);
                }
            }

            educatorTable.innerHTML = '';
            educatorTable.appendChild(tableBody);
        })
        .catch(error => console.error('Error:', error));
}

function jumpToTimestamp(timestamp) {
  // Extract hours, minutes, and seconds from the timestamp
  var [hours, minutes, seconds] = timestamp.split(':');

  // Calculate the total number of seconds
  var totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

  // Seek to the specified timestamp in the video
  var video = document.querySelector('#videoPlayer video');
  video.currentTime = totalSeconds;
}

// Function to show a message on the page
function showMessage(message) {
  var messageContainer = document.createElement("div");
  messageContainer.className = "message";
  messageContainer.textContent = message;
  document.body.appendChild(messageContainer);
}

});


