<?php
  header("Content-Type:application/json;charset=utf-8");
  require("init.php");
  @$uid=$_REQUEST['uid'] or die('{"code":-2,"msg":"用户ID不能为空"}');
  $sql="select * from balena_order where userId=$uid";
  $result=mysqli_query($conn,$sql);
  $orderList=mysqli_fetch_all($result,MYSQLI_ASSOC);
  //遍历每个订单，查询该订单中的产品信息
  foreach($orderList as $i=>$order){
    $oid=$order["oid"];
    $sql="select * from balena_product where pid in (select productId from balena_order_detail where orderId=$oid)";
    $result=mysqli_query($conn,$sql);
    $plist=mysqli_fetch_all($result,MYSQLI_ASSOC);

    //$order['products']=$plist;   //无效表达
    $orderList[$i]['products']=$plist;
  }
  echo json_encode($orderList);