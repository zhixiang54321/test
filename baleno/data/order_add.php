<?php
/***
*接收客户端提交的rcvName, rcvAddr, rcvPhone, price, payment，userId，
*生成一个订单，得到订单编号；继续读取指定用户的购物车内容，
*据此生成订单详情，并删除购物车中的响应条目，
*返回{"code":1,"msg":"订单生成成功","oid":90000006}
*/
  header("Content-Type:application/json;charset=utf-8");
  require("init.php");
//接收客户端提交的rcvName, rcvAddr, rcvPhone, price, payment，userId，生成一个订单
  @$rcvName=$_REQUEST['rcvName'] or die('{"code":-2,"msg":"收件人姓名不能为空"}');
  @$rcvAddr=$_REQUEST['rcvAddr'] or die('{"code":-3,"msg":"收件人地址不能为空"}');
  @$rcvPhone=$_REQUEST['rcvPhone'] or die('{"code":-4,"msg":"收件人手机号不能为空"}');
  @$price=$_REQUEST['price'] or die('{"code":-5,"msg":"价格不能为空"}');
  @$payment=$_REQUEST['payment'] or die('{"code":-6,"msg":"支付方式不能为空"}');
  @$userId=$_REQUEST['userId'] or die('{"code":-7,"msg":"下单用户编号不能为空"}');
  $ot=time()*1000;//下单时间就是当前系统时间
  $os=1;//订单状态
  $sql="insert into balena_order values(null,'$rcvName','$rcvAddr','$rcvPhone','$price','$payment','$ot','$os','$userId');";
  $result=mysqli_query($conn,$sql);
  $oid=mysqli_insert_id($conn);
  $sql="SELECT did,productId,count FROM balena_cart_detail WHERE cartId=(SELECT cid FROM balena_cart WHERE userId='$userId')";
  $result=mysqli_query($conn,$sql);
  $pList=mysqli_fetch_all($result,MYSQLI_ASSOC);
  foreach($pList as $p){
    //SQL3：根据购物车内容，生成订单详情
    $sql = "INSERT INTO balena_order_detail VALUES(NULL,'$oid','$p[productId]','$p[count]')";
    mysqli_query($conn,$sql);

    //SQL4：从购物车中删除已购买的商品
    $sql = "DELETE FROM balena_cart_detail WHERE did=$p[did]";
    mysqli_query($conn,$sql);
  }
  echo '{"code":1,"msg":"订单生成成功","oid":'.$oid.'}';