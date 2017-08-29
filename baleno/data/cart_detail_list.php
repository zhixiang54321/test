<?php
  require("init.php");
  header("Content-Type:application/json;charset=utf-8");
    //(14)编写PHP：cart_detail_list.php，接收客户端提交的用户编号，查询出该用户购物车中的所有商品信息，以JSON格式返回
  @$userId=$_REQUEST['userId'] or die('{"code":-2,"msg":"用户编号为空"}');
  $sql="SELECT pid,pname,price,pic,count,did FROM balena_product,balena_cart_detail WHERE cartId=(SELECT cid FROM balena_cart WHERE userId='$userId') AND pid=productId";
  $result=mysqli_query($conn,$sql);
  if($result===false){
	echo '{"code":-4,"msg":"sql err"}';
  }else{
	$rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
	if($rows===null){
		echo '{"code":-1,"msg":"用户编号错误"}';
	}else{
		echo json_encode($rows);
	}
  }
