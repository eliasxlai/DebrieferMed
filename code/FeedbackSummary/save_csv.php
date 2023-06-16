<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['csvData'])) {
  $csvData = $_POST['csvData'];
  $filename = "../Data/student_data.csv";

  // Check if the file exists
  $fileExists = file_exists($filename);

  // Add a newline if the file already existed and the CSV data was appended
  if ($fileExists) {
    $csvData = "\n" . $csvData;
  }

  // Save the CSV data to the existing file
  file_put_contents($filename, $csvData, FILE_APPEND | LOCK_EX);

  echo "CSV data saved successfully.";
} else {
  echo "Invalid request.";
}
?>
