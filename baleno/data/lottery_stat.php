<?php
/**
*接收客户端提交的uid，返回该用户的抽奖统计情况
*（假设消费￥1000产生一个抽奖机会），
*形如：{uid: 10, total: 13, used: 3}
*/
header('Content-Type: application/json');

@$uid = $_REQUEST['uid'] or die('{"code":-2,"msg":"用户编号不能为空"}');

require('init.php');

$output = [
    'uid'=>$uid,
    'total'=>10,
    'used'=>0
];
//SQL1: 查询用户的订单总金额
//$sql = "SELECT SUM(price) FROM jd_order WHERE userId=$uid";
//$result = mysqli_query($conn,$sql);
//$row = mysqli_fetch_row($result);
//$output['total'] = floor($row[0]/1000); //每￥1000自动获得一次抽奖机会

//SQL2: 查看用户已经抽奖的次数
$sql = "SELECT COUNT(*) FROM balena_lottery WHERE userId=$uid";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_row($result);
$output['used'] = intval($row[0]);

echo json_encode($output);