var filesToUpload = [];

function handleFileSelect(e) {
    e.preventDefault();

    var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    var teamId = document.getElementById('teamId').value;
    var takeNumber = document.getElementById('takeNumber').value;

    for (var i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('video/')) {
            files[i].teamId = teamId;
            files[i].takeNumber = takeNumber;
            filesToUpload.push(files[i]);
            displayFilePreview(files[i]);
        } else {
            alert('Only video files are allowed.');
        }
    }
}

function displayFilePreview(file) {
    var fileList = document.getElementById('fileList');

    var videoElement = document.createElement('video');
    videoElement.className = 'videoPreview';
    videoElement.src = URL.createObjectURL(file);
    videoElement.controls = true;

    var fileNameElement = document.createElement('p');
    fileNameElement.textContent = file.name;

    fileList.appendChild(videoElement);
    fileList.appendChild(fileNameElement);
}

function uploadFiles() {
    if (filesToUpload.length === 0) {
        alert('Please select some video files to upload.');
        return;
    }

    var formData = new FormData();

    for (var i = 0; i < filesToUpload.length; i++) {
        var file = filesToUpload[i];
        var fileName = 'TID' + file.teamId + 'TN' + file.takeNumber + '.mp4';
        formData.append('files[]', file, fileName);
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload.php', true);

    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            var percentage = (e.loaded / e.total) * 100;
            var progressBar = document.getElementById('progressBar');
            progressBar.style.width = percentage + '%';
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('Files uploaded successfully.');
        } else {
            alert('File upload failed.');
        }
    };

    xhr.send(formData);

    // Clear the file list and reset the files
    var fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    filesToUpload = [];
}

// Add event listeners for drag and drop
var dropArea = document.getElementById('dropArea');
dropArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropArea.classList.add('highlight');
});
dropArea.addEventListener('dragleave', function () {
    dropArea.classList.remove('highlight');
});
dropArea.addEventListener('drop', handleFileSelect);

// Add event listener for file input change
var fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', handleFileSelect);
