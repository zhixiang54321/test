<?php
  require("init.php");
  header("Content-Type:application/json;charset=utf-8");
  @$uname=$_REQUEST['uname'] or die('{"code":-2,"msg":"�û�������Ϊ��"}');
  @$upwd=$_REQUEST['upwd'] or die('{"code":-3,"msg":"���벻��Ϊ��"}');
  $sql="select uid from bn_user where uname='$uname' and upwd='$upwd'";
  $result=mysqli_query($conn,$sql);
  if($result===false){
	echo '{"code":-4,"msg":"sql err"}';
  }else{
	$row=mysqli_fetch_assoc($result);
	if($row===null){
		echo '{"code":-1,"msg":"�û������������"}';
	}else{
		echo '{"code":1,"msg":"login succ","uid":'.$row['uid'].',"uname":"'.$uname.'"}';
		//$uid=$row[0];
		//$output=[
			//'code'=>1,
			//'msg'=>"��¼�ɹ�",
			//'uname'=>$uname,
			//'upwd'=>$upwd
		//];
		//echo json_encode($output);
	}
  }