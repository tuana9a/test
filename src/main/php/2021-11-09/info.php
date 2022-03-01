<?php 
    include "./model.php";
    $id = $_POST["id"];
    $value = $data[$id]->tostring();
    echo $value;
?>