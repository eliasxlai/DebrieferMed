<?php
// PHP code for adding rows to an existing CSV file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (isset($_POST['csvContent'])) {
    $csvContent = $_POST['csvContent'];

    // Define the path to the CSV file
    $csvFilePath = '../Data/educator_data.csv';

    // Read the existing CSV file
    $existingContent = file_get_contents($csvFilePath);

    // Remove the title row from the new content
    $csvRows = explode("\r\n", $csvContent);
    array_shift($csvRows);
    $newContent = implode("\r\n", $csvRows);

    // Append the new content to the existing file, excluding the title row
    if (!empty($existingContent)) {
      $existingRows = explode("\r\n", $existingContent);
      $mergedRows = array_merge($existingRows, $csvRows);
      $newContent = implode("\r\n", $mergedRows);
    }

    // Write the updated content back to the CSV file
    file_put_contents($csvFilePath, $newContent);

    // Response to the client
    echo 'success';
  }
}
?>
