<?php
    include 'conn.php';
    $name = isset($_REQUEST['name']) ? $_REQUEST['name'] : '';
    $names = isset($_REQUEST['names']) ? $_REQUEST['names'] : '';
    $passw = isset($_REQUEST['passw']) ? $_REQUEST['passw'] : '';
    $num = isset($_REQUEST['num']) ? $_REQUEST['num'] : '';
    $email = isset($_REQUEST['email']) ? $_REQUEST['email'] : '';
    $phone = isset($_REQUEST['phone']) ? $_REQUEST['phone'] : '';
    $sum = isset($_REQUEST['sum']) ? $_REQUEST['sum'] : '';
    $id = isset($_REQUEST['id']) ? $_REQUEST['id'] : ''; 
    $names = isset($_REQUEST['names']) ? $_REQUEST['names'] : ''; 
    $quantity = isset($_REQUEST['quantity']) ? $_REQUEST['quantity'] : ''; 
    $imgs = isset($_REQUEST['imgs']) ? $_REQUEST['imgs'] : ''; 
    $oid = isset($_REQUEST['oid']) ? $_REQUEST['oid'] : ''; 
    $yonghu = isset($_REQUEST['yonghu']) ? $_REQUEST['yonghu'] : ''; 
    $yid = isset($_REQUEST['yid']) ? $_REQUEST['yid'] : ''; 
    $uid = isset($_REQUEST['uid']) ? $_REQUEST['uid'] : ''; 
    $yong = isset($_REQUEST['yong']) ? $_REQUEST['yong'] : ''; 
    $pirce= isset($_REQUEST['pirce']) ? $_REQUEST['pirce'] : '';

    switch ($num) {
            case '1':
				$sql = "SELECT * FROM xinxi WHERE $sum = '$names'";
                break;
			case '2':
				$sql = "INSERT INTO xinxi(number,passw,num,email) VALUES('$name','$passw','$phone','$email')";//注册保存
                break;
            case '3':
                $sql = "SELECT * FROM xinxi WHERE $sum='$name' AND passw='$passw'";//登录验证账号密码
                break;
            case '4':
				$sql = "SELECT * FROM xinxi WHERE num = '$phone'";//注册验证手机号码
                break;
            case '5':
				$sql = "SELECT * FROM list WHERE cid=$id";//详情页渲染
                break;
            case '6':
				$sql = "INSERT INTO gwc(names,imgs,quantity,oid,yid,pirce) VALUES('$names','$imgs','$quantity','$oid','$yid','$pirce');";
                break;
            case '7':
				$sql = "SELECT * FROM gwc WHERE yid=$yong";//购物车页渲染
                break; 
            case '8':
				$sql = "SELECT * FROM xinxi WHERE number = '$yonghu'";//获取用户ID
                break; 
            case '9':
				$sql = "DELETE FROM gwc WHERE oid = $uid";//删除单个数据
                break; 
            case '10':
				$sql = "DELETE FROM gwc WHERE yid = $uid";//删除用户购物车数据
                break;                       
		}

    $res = $conn->query($sql);
    if($num == '1'){
        $res = $conn->query($sql);
        $arr = $res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($arr);
        $conn->set_charset('utf8');
        $res->close();
        $conn->close();
    }else if($num == '2'){
        if($res){
            echo 'yes';
        }else{
            echo 'no';
        }
    }else if($num == '3'){
        if($res->num_rows){
            echo 'yes';
        }else{
            echo 'no';
        }
    }else if($num == '4'){
        if($res->num_rows){
            echo 'no';
        }else{
            echo 'yes';
        }
    }else if($num == '5'){
        $res = $conn->query($sql);
        $arr = $res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($arr);
        $conn->set_charset('utf8');
        $res->close();
        $conn->close();
    }else if($num == '6'){
        if($res){
            echo 'yes';
        }else{
            echo 'no';
        }
    }else if($num == '7'){
       $res = $conn->query($sql);
        $arr = $res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($arr);
        $conn->set_charset('utf8');
        $res->close();
        $conn->close();
    }else if($num == '8'){
       $res = $conn->query($sql);
        $arr = $res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($arr);
        $conn->set_charset('utf8');
        $res->close();
        $conn->close();
    }else if($num == '9'){
        if($res){
            echo 'yes';
        }else{
            echo 'no';
        }
    }else if($num == '10'){
        if($res){
            echo 'yes';
        }else{
            echo 'no';
        }
    }

?>