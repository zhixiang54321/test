<?php
  header("Content-Type:application/json;charset=utf-8");
  require("init.php");
  //接收客户端提交的用户编号（uid）、产品编号（pid）
  @$uid=$_REQUEST['uid'] or die('{"code":-2,"msg":"用户编号不能为空"}');
  @$pid=$_REQUEST['pid'] or die('{"code":-3,"msg":"产品编号不能为空"}');
  //SQL1：根据用户编号查询出他对应的购物车编号
  $sql="select cid from balena_cart where userId='$uid'";
  $result=mysqli_query($conn,$sql);
  if($result===false){
	echo '{"code":-4,"msg":"sql err"}';
  }else{
	$row=mysqli_fetch_assoc($result);
	if($row===null){
		echo '{"code":-1,"msg":"没有购物车"}';
		//SQL2：如果用户没有购物车，则添加一个购物车，获得购物车编号
		$sql="insert into balena_cart values(null,$uid);";
		$result=mysqli_query($conn,$sql);
		echo '{"cid":'.mysqli_insert_id($conn).'}';
	}else{
		//echo '{"code":1,"msg":"login购物车","cid":'.$row['cid'].'}';
		//SQL3：查询购物车详情，对应的购物车编号+产品编号是否存在
		$sql="select did,count from balena_cart_detail where cartId='$row[cid]' and productId='$pid'";
		$res=mysqli_query($conn,$sql);
		if($res===false){
			echo '{"code":-5,"msg":"sql err"}';
		}else{
			$row1=mysqli_fetch_assoc($res);
			//var_dump($row1);
			if($row1===null){
			   echo '{"code":2,"msg":"购买","count":1}';
			   //SQL4：若之前未购买过该商品，则插入一条购买记录，购买数量为1
			   $sql="insert into balena_cart_detail values(null,$row[cid],$pid,1)";
			   mysqli_query($conn,$sql);

			}else{
				//SQL5：若之前已经购买该商品，则更新购买数量+1
				$sql="update balena_cart_detail set count='$row1[count]'+1 where did='$row1[did]'";
				mysqli_query($conn,$sql);
				$sql="select count from balena_cart_detail where did='$row1[did]'";
				$re=mysqli_query($conn,$sql);
				$row=mysqli_fetch_assoc($re);
				$count=$row['count'];
				echo '{"code":11,"msg":"购买成功","did":'.$row1['did'].',"count":'.$count.'}';
				$r=mysqli_query($conn,$sql);
			}
		}
	}
  }