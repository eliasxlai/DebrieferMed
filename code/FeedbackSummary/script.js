function allowDrop(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();

  const files = event.dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const extension = file.name.split('.').pop().toLowerCase();

    if (extension === 'mp4' || extension === 'mov') {
      displayVideo(file);
    } else if (extension === 'csv') {
      displayCSV(file);
    } else {
      alert('Invalid file type. Please upload a video (MP4/MOV) or a CSV file.');
    }
  }
}

function displayVideo(file) {
  const videoContainer = document.getElementById('video-container');
  videoContainer.innerHTML = `<video id="main-video" controls><source src="${URL.createObjectURL(
    file
  )}" type="video/mp4"></video>`;
}

function displayCSV(file) {
  const csvTable = document.getElementById('csv-table');
  csvTable.innerHTML = '';

  const reader = new FileReader();
  reader.onload = function (e) {
    const contents = e.target.result;
    const rows = contents.split('\n');

    const headers = rows[0].split(',');
    const columnCount = headers.length;

    const headerRow = document.createElement('tr');
    for (let i = 0; i < columnCount; i++) {
      const headerCell = document.createElement('th');
      headerCell.textContent = headers[i];
      headerRow.appendChild(headerCell);
    }
    headerRow.innerHTML += '<th>Reflections</th>'; // Add "Reflections" column header
    csvTable.appendChild(headerRow);

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].split(',');
      const row = document.createElement('tr');

      for (let j = 0; j < columnCount; j++) {
        const cell = document.createElement('td');

        if (j === 2) {
          // Color column (assuming it's the third column)
          const colorValue = parseInt(cells[j].trim(), 10);
          const colorRectangle = document.createElement('div');
          colorRectangle.classList.add('color-rectangle');

          if (colorValue === 5) {
            colorRectangle.style.backgroundColor = 'green';
          } else if (colorValue === 3) {
            colorRectangle.style.backgroundColor = 'yellow';
          } else if (colorValue === 1) {
            colorRectangle.style.backgroundColor = 'red';
          }

          cell.classList.add('color-column');
          cell.appendChild(colorRectangle);
        } else if (j === 3) {
          // Timestamp column (assuming it's the fourth column)
          const timestampValue = cells[j].trim();
          const timestampParts = timestampValue.split(':');
          const timestampInSeconds =
            parseInt(timestampParts[0], 10) * 3600 +
            parseInt(timestampParts[1], 10) * 60 +
            parseInt(timestampParts[2], 10);

          const timestampLink = document.createElement('a');
          timestampLink.href = `javascript:seekToTimestamp(${timestampInSeconds})`;
          timestampLink.textContent = timestampValue;
          timestampLink.classList.add('timestamp-column');

          cell.appendChild(timestampLink);
        } else {
          cell.textContent = cells[j];
        }

        row.appendChild(cell);
      }

      const reflectionsCell = document.createElement('td');
      const reflectionsInput = document.createElement('input');
      reflectionsInput.type = 'text';
      reflectionsInput.classList.add('reflections-input');
      reflectionsCell.classList.add('reflections-column');
      reflectionsCell.appendChild(reflectionsInput);
      row.appendChild(reflectionsCell);

      csvTable.appendChild(row);
    }
  };

  reader.readAsText(file);
}

function seekToTimestamp(timestampInSeconds) {
  const video = document.getElementById('main-video');
  video.currentTime = timestampInSeconds;
}

function saveCSVFile(csvData) {
  const formData = new FormData();
  formData.append("csvData", csvData);

  fetch("save_csv.php", {
    method: "POST",
    body: formData,
  })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      // You can perform additional actions after the CSV file is saved
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function exportToCSV() {
  let csvContent = "";

  // Get the table
  const table = document.getElementById("csv-table");

  // Get table rows
  const rows = table.getElementsByTagName("tr");

  // Iterate over rows
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("th, td");
    let row = "";

    // Skip the first row (column names)
    if (i === 0) continue;

    // Iterate over cells in the row
    for (let j = 0; j < cells.length; j++) {
      let cellContent;
      if (j === cells.length - 1) {
        // For the reflections column, get the input value instead of innerText
        const input = cells[j].querySelector("input");
        cellContent = input ? input.value : "";
      } else {
        cellContent = cells[j].innerText.replace(",", " "); // Replace commas in cell content with spaces
      }

      row += j === 0 ? cellContent : "," + cellContent; // Add cell content with comma separation
    }

    csvContent += i === 1 ? row : "\n" + row; // Add row with line break
  }

  // Save the CSV file on the server
  saveCSVFile(csvContent);

  // Clear the input values and add a new row to the table
  const reflectionInputs = table.querySelectorAll("tr:not(:first-child) td:last-child input");
  reflectionInputs.forEach(input => (input.value = ""));

  const newRow = document.createElement("tr");
  newRow.innerHTML = `<td></td><td></td><td></td><td></td><td><input type="text"></td>`;
  table.appendChild(newRow);
}