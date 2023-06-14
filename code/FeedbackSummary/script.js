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
  videoContainer.innerHTML = `<video controls><source src="${URL.createObjectURL(file)}" type="video/mp4"></video>`;
}

function displayCSV(file) {
  const csvTable = document.getElementById('csv-table');
  csvTable.innerHTML = '';
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const contents = e.target.result;
    const rows = contents.split('\n');
    
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].split(',');
      const row = document.createElement('tr');
      
      for (let j = 0; j < cells.length; j++) {
        const cell = document.createElement(i === 0 ? 'th' : 'td');
        cell.textContent = cells[j];
        row.appendChild(cell);
      }
      
      csvTable.appendChild(row);
    }
  };
  
  reader.readAsText(file);
}
