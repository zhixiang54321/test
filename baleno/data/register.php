<?php
    header("Content-Type:application/json;charset=utf-8");
    require("init.php");
    //接收客户端提交的uname和upwd，添加入数据库，
    //返回{"code":1,"msg":"注册成功","uid":23}或者{"code":-2,"msg":"用户名不能为空"}
    @$uname=$_REQUEST['uname'] or die('{"code":-2,"msg":"用户名不能为空"}');
    @$upwd=$_REQUEST['upwd'] or die('{"code":-3,"msg":"用户密码不能为空"}');
    $sql="select uid from bn_user where uname='$uname'";
    $res=mysqli_query($conn,$sql);
    $row=mysqli_fetch_row($res);
    if(!$row){
        $sql="insert into bn_user values(null,'$uname','$upwd')";
        $result=mysqli_query($conn,$sql);
        if($result===false){
            echo '{"code":-4,"msg":"sql err"}';
        }else{
            $uidz=mysqli_insert_id($conn);
//        echo '{"code":1,"msg":"注册成功","uid:"'.$uidz.'}';
            $output=[
                "code"=>1,
                "msg"=>"注册成功",
                "uid"=>$uidz
            ];
           echo json_encode($output);
        }
    }else{
        echo '{"code":"-5","msg":"用户名已经存在"}';
    }
