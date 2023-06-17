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
        const csvPath = '../Data/educator_data.csv';

        fetch(csvPath)
            .then(response => response.text())
            .then(csvData => {
                const rows = csvData.split('\n');
                const tableHeaders = rows[0].split(',');
                const tableBody = document.createElement('tbody');

                // Add reflection column header
                tableHeaders.push('Reflection');

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
                    const rowData = row.slice(0, 6); // Get the first 6 columns from the CSV

                    if (rowData[4] == teamId && rowData[5] == takeNumber) {
                        const tableRow = document.createElement('tr');

                        // Check color value and replace with color rectangle
                        const colorValue = Number(rowData[3]);
                        let colorClass = '';
                        if (colorValue === 1) {
                            colorClass = 'red';
                        } else if (colorValue === 3) {
                            colorClass = 'yellow';
                        } else if (colorValue === 5) {
                            colorClass = 'green';
                        }

                        rowData[3] = `<div class="color-rectangle ${colorClass}"></div>`;

                        // Add reflection column with input field
                        rowData.push(`<input class="reflection-input" type="text" value="">`);

                        rowData.forEach(data => {
                            const td = document.createElement('td');
                            td.innerHTML = data;
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

// Function to send data to the server and append to the CSV file
function appendToCSV(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "append_csv.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText); // Output the server response
        showMessage("Reflections saved");
        setTimeout(function() {
          window.location.href = "../index.html";
        }, 2000); // Redirect after 2 seconds
      }
    };
    xhr.send("data=" + encodeURIComponent(data));
  }

  // Function to show a message on the page
  function showMessage(message) {
    var messageContainer = document.createElement("div");
    messageContainer.className = "message";
    messageContainer.textContent = message;
    document.body.appendChild(messageContainer);
  }
  
  // Function to export the table data as a CSV and append to the server-side file
  function handleExportButtonClick() {
    var csv = [];
    var rows = document.querySelectorAll("#educatorTable tr");
  
    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td");
  
      for (var j = 0; j < cols.length - 1; j++) {
        row.push(cols[j].innerText);
      }
  
      // Get the reflection input value if it exists
      if (cols.length > 6) {
        var reflectionInput = cols[6].querySelector("input");
        if (reflectionInput) {
          row.push(reflectionInput.value);
        }
      }
  
      csv.push(row.join(","));
    }
  
    var csvData = csv.join("\n");
    appendToCSV(csvData);
  }
  
  // Attach event listener to the export button
  var exportButton = document.getElementById("exportButton");
  exportButton.addEventListener("click", handleExportButtonClick);
  

});


