<?php
//接收客户端提交的详情编号did和修改后的购买数量count，更新该购物车详情记录，返回{"code":1,"msg":"更新成功"} 
  require("init.php");
  header("Content-Type:application/json;charset=utf-8");
  @$did=$_REQUEST['did'] or die('{"code":-2,"msg":"详情编号不能为空"}');
  @$count=$_REQUEST['count'] or die('{"code":-3,"msg":"购买数量不能为空"}');
  $sql="update balena_cart_detail set count='$count' where did='$did'";
  $result=mysqli_query($conn,$sql);
  if($result===false){
	echo '{"code":-4,"msg":"sql err"}';
  }else{
	//$row=mysqli_fetch_assoc($result);
	//if($row===null){
		//echo '{"code":-1,"msg":"详情编号错误"}';
	//}else{
		echo '{"code":1,"msg":"更新成功","did":"'.$did.'"}';
		//echo json_encode($output);
	
  }