<?php
    include 'conn.php';
    $name = isset($_REQUEST['name']) ? $_REQUEST['name'] : '';
    $passw = isset($_REQUEST['passw']) ? $_REQUEST['passw'] : '';
    $sql = "SELECT * FROM xinxi WHERE number='$name' AND passw='$passw'";
    $res = $conn->query($sql);
    if($res->num_rows) {
        //查到，不给注册
        echo 'yes';
    }else {
         echo 'no';
    }
?>