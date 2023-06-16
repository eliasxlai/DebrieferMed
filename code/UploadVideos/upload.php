<?php
$uploadDir = '../Data/Videos/';

if (!empty($_FILES['files']['name'][0])) {
    $fileCount = count($_FILES['files']['name']);

    for ($i = 0; $i < $fileCount; $i++) {
        $tempName = $_FILES['files']['tmp_name'][$i];
        $fileName = $_FILES['files']['name'][$i];
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($tempName, $targetPath)) {
            // File uploaded successfully
            echo 'Success';
        } else {
            // Failed to move the uploaded file
            echo 'Error';
        }
    }
} else {
    // No files uploaded
    echo 'Error';
}
?>
