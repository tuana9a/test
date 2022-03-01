<?php
    $category_id = $_POST["category_id"];
    $title = $_POST["title"];
    $description = $_POST["description"];

    $servername = "localhost";
    $username = "username";
    $password = "password";

    $conn = new mysqli_connect($servername, $username, $password, "mydb");

    $sql = "INSERT INTO category (category_id, title, description) VALUES ($category_id, $title, $description);";
    $success = $conn->query($sql);
    if($success) {
        echo "success";
    } else {
        echo "failed";
    }

    $conn->close();
?>

