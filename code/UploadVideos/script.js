function handleFiles(files) {
    var fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
  
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var li = document.createElement('li');
      li.innerHTML = file.name;
      fileList.appendChild(li);
    }
  }
  
  function handleDrop(e) {
    e.preventDefault();
    var files = e.dataTransfer.files;
    handleFiles(files);
  }
  
  function handleDragOver(e) {
    e.preventDefault();
  }
  
  function saveFiles() {
    var files = document.getElementById('fileElem').files;
    if (files.length > 0) {
      var formData = new FormData();
      for (var i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
      }
  
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'upload.php');
      xhr.send(formData);
  
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            alert('Files saved successfully!');
          } else {
            alert('Error saving files.');
          }
        }
      };
    }
  }
  
  var dropArea = document.getElementById('drop-area');
  dropArea.addEventListener('dragover', handleDragOver, false);
  dropArea.addEventListener('drop', handleDrop, false);
  