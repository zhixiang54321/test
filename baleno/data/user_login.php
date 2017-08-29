<?php
  require("init.php");
  header("Content-Type:application/json;charset=utf-8");
  @$uname=$_REQUEST['uname'] or die('{"code":-2,"msg":"用户名不能为空"}');
  @$upwd=$_REQUEST['upwd'] or die('{"code":-3,"msg":"密码不能为空"}');
  $sql="select uid from bn_user where uname='$uname' and upwd='$upwd'";
  $result=mysqli_query($conn,$sql);
  if($result===false){
	echo '{"code":-4,"msg":"sql err"}';
  }else{
	$row=mysqli_fetch_assoc($result);
	if($row===null){
		echo '{"code":-1,"msg":"用户名或密码错误"}';
	}else{
		echo '{"code":1,"msg":"login succ","uid":'.$row['uid'].',"uname":"'.$uname.'"}';
		//$uid=$row[0];
		//$output=[
			//'code'=>1,
			//'msg'=>"登录成功",
			//'uname'=>$uname,
			//'upwd'=>$upwd
		//];
		//echo json_encode($output);
	}
  }