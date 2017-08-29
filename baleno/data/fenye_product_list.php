<?php
  require("init.php");
  header("Content-Type:application/json;charset=utf-8");
  //$sql="select * from balena_product";
  //$result=mysqli_query($conn,$sql);
  //$rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
  //echo json_encode($rows);

  //接收客户端提交的要显示的页号
  @$pno=$_REQUEST['pageNum'];
  if($pno===null){
	$pno=1;
  }else{
	$pno=intval($pno);
  }
  
  $output=[
	'recordCount'=>0,
	'pageSize'=>8,
	'pageCount'=>0,
	'pageNum'=>$pno,
	'data'=>null
  ];
  $sql="select count(*) from balena_product";
  $result=mysqli_query($conn,$sql);
  $row=mysqli_fetch_row($result);
  $output['recordCount']=intval($row[0]);
  //计算总页数
  $output['pageCount']=ceil($output['recordCount']/$output['pageSize']);
  $start=($output['pageNum']-1)*$output['pageSize'];
  $count=$output['pageSize'];
  $sql="select * from balena_product limit $start,$count";
  $result=mysqli_query($conn,$sql);
  $output['data']=mysqli_fetch_all($result,MYSQLI_ASSOC);

  echo json_encode($output);