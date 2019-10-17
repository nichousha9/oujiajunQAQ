<?php
    $page = isset($_GET['page']) ? $_GET['page'] : '1';
    $sum = isset($_GET['sum']) ? $_GET['sum'] : '8';
    include 'conn.php';
    header("Content-type:text/html;charset=utf-8");
    $index = ($page - 1) * $sum;
    $sql = "SELECT * FROM list LIMIT $index,$sum";
    $sql2 = "SELECT * FROM list";
    $res = $conn->query($sql);
    $res2 = $conn->query($sql2);
    $arr = $res->fetch_all(MYSQLI_ASSOC);
    $data = array(
        'total' => $res2->num_rows,
        'data' => $arr,
        'page' => $page,
        'sum' => $sum
    );

    echo json_encode($data);
    $conn->set_charset('utf8');
?>