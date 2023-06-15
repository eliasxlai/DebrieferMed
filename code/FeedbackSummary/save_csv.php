<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['csvData'])) {
  $csvData = $_POST['csvData'];
  $timestamp = date("Y-m-d_H-i-s");
  $filename = "Student_CSVs/table_data_$timestamp.csv";

  // Save the CSV data to the server
  file_put_contents($filename, $csvData);

  echo "CSV file saved successfully.";
} else {
  echo "Invalid request.";
}
?>
