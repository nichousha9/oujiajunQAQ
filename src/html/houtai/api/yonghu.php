<?php
include 'conn.php';
// header("Content-type:text/html;charset=utf-8");
$sql = "SELECT * FROM xinxi;";
$res = $conn->query($sql);
$arr = $res->fetch_all(MYSQLI_ASSOC);
echo json_encode($arr);
$res->close();
$conn ->close();
?>