<?php
$data = $_POST['data'];
$filePath = "../Data/student_data.csv";

// Append the data to the CSV file
$file = fopen($filePath, "a");
fwrite($file, $data);
fclose($file);

echo "Data appended successfully.";
?>
