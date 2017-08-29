<?php
/**
*接收客户端提交的uid，伪造过去十二个月的消费记录，返回：
 [	{"label":"1月", "value": 3500},
 		....
 {"label":"12月", "value": 3500}    ]
*/
header('Content-Type: application/json');

@$uid = $_REQUEST['uid'] or die('{"code":-2,"msg":"用户编号不能为空"}');

//此处没有连接数据库，伪造了数据
$output = [
  ['label'=>'1月', 'value'=>4000],
  ['label'=>'2月', 'value'=>3500],
  ['label'=>'3月', 'value'=>4500],
  ['label'=>'4月', 'value'=>6000],
  ['label'=>'5月', 'value'=>3000],
  ['label'=>'6月', 'value'=>5500],
  ['label'=>'7月', 'value'=>8500],
  ['label'=>'8月', 'value'=>5000],
  ['label'=>'9月', 'value'=>5600],
  ['label'=>'10月', 'value'=>6000],
  ['label'=>'11月', 'value'=>7000],
  ['label'=>'12月', 'value'=>5800]
];

echo json_encode($output);