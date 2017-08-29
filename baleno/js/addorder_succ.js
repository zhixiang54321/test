//如果用户没有登录，跳转到登录页面
if(!sessionStorage["loginUid"]){
  location.href="Balena_index.html";
}
//功能2 异步请求页头页尾，修改页头中的欢迎消息
$("#header").load("data/header.php", function () {
  $("#welcome").html("欢迎回来"+sessionStorage["loginUname"]);
});
$("#footer_bottom").load("data/footer.php");

/**功能点3：显示成功创建的订单编号**/
$('#oid').html( sessionStorage['oid'] );
sessionStorage.removeItem('oid'); //删除已经显示给用户的订单编号
