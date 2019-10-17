<?php
    $serverna = 'localhost';
    $username = 'root';
    $password = 'root';
    $dbname = 'alis';
    $conn = new mysqli($serverna,$username,$password,$dbname);
    if($conn->connect_error){
      die('链接失败'. $conn->connect_error);
    }else{
      // echo'链接成功';
    } 
?>