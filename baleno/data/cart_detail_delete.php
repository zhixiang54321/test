<?php
  header("Content-Type:application/json;charset=utf-8");
  require("init.php");
  @$did=$_REQUEST['did'] or die('{"code":-2,"msg":"购物产品编号不能为空"}');
  $sql="delete from balena_cart_detail where did='$did'";
  $result=mysqli_query($conn,$sql);
  if($result===false){
	echo '{"code":-4,"msg","sql err"}';
  }else{
	echo '{"code":1,"msg":"删除成功"}';
}