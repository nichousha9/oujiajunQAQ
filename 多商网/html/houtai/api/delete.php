<?php
    include 'conn.php';
    $name = isset($_REQUEST['arr']) ? $_REQUEST['arr'] : '';
    $sql = "DELETE FROM xinxi WHERE cid = $name;";
    $res = $conn->query($sql);
    echo '删除成功'
?>