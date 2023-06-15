<?php
$uploadDir = '../Data/Videos/';

if (!empty($_FILES['files']['name'][0])) {
  $files = $_FILES['files'];

  for ($i = 0; $i < count($files['name']); $i++) {
    $fileName = $files['name'][$i];
    $fileTmpName = $files['tmp_name'][$i];
    $fileDestination = $uploadDir . $fileName;

    if (move_uploaded_file($fileTmpName, $fileDestination)) {
      echo "File $fileName uploaded successfully.\n";
    } else {
      echo "Error uploading file $fileName.\n";
    }
  }
} else {
  echo "No files received.\n";
}
?>
