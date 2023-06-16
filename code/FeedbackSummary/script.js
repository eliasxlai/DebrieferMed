document.getElementById('videoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var teamID = Number(document.getElementById('teamID').value);
    var takeNumber = Number(document.getElementById('takeNumber').value);
    
    var videoSource = '../Data/Videos/TID' + teamID + 'TN' + takeNumber + '.mp4';
    
    var videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.innerHTML = '<video controls><source src="' + videoSource + '" type="video/mp4"></video>';
    
    // Fetch and display the CSV table
    fetch('../Data/educator_data.csv')
        .then(response => response.text())
        .then(data => {
            var table = document.getElementById('educatorTable');
            table.innerHTML = ''; // Clear the table before adding new rows
            
            var rows = data.split('\n');
            rows.forEach((row, rowIndex) => {
                var rowData = row.split(',');
                var rowDataTeamID = Number(rowData[4]); // Team ID column index
                var rowDataTakeNumber = Number(rowData[5]); // Take Number column index
                
                if (rowIndex === 0 || (rowDataTeamID === teamID && rowDataTakeNumber === takeNumber)) {
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
                        } else {
                            tableCell.textContent = cellData;
                        }
                        tableRow.appendChild(tableCell);
                    });
                    
                    if (rowIndex === 0) {
                        var reflectionHeaderCell = document.createElement('th');
                        reflectionHeaderCell.textContent = 'Reflection';
                        tableRow.appendChild(reflectionHeaderCell);
                    } else {
                        var reflectionInputCell = document.createElement('td');
                        var reflectionInput = document.createElement('input');
                        reflectionInput.type = 'text';
                        reflectionInput.classList.add('reflection-input');
                        reflectionInputCell.appendChild(reflectionInput);
                        tableRow.appendChild(reflectionInputCell);
                    }
                    
                    table.appendChild(tableRow);
                }
            });
        });
});
