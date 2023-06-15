<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['csvData'])) {
  $csvData = $_POST['csvData'];
  $filename = "../Data/student_data.csv";

  // Append the CSV data to the existing file
  file_put_contents($filename, $csvData, FILE_APPEND | LOCK_EX);

  echo "CSV data saved successfully.";
} else {
  echo "Invalid request.";
}
?>
