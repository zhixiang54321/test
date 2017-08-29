/**功能点1：若用户未登录，则跳转到登录页面（产品列表页）**/
if(!sessionStorage['loginUid']){
  location.href = 'Balena_index.html';
}
document.onload=function(){
  if(sessionStorage["loginUid"]===null){
    location.href="Balena_index.html";
  }
}
$(function(){
  $("#site_header").load("data/header.php",function(){
    $("#welcome").html(`登录成功，欢迎回来：${sessionStorage["loginUname"]}！<a href="#" >[退出]</a>`);
  });
  $("#footer_bottom").load("data/footer.php");
})

//3页面加载完后，异步请求当前登录用户的购物车内容
window.onload=function() {
  $.ajax({
    type: "GET",
    url: "data/cart_detail_list.php",
    //data:{"userId":cookieObject.loginUid},
    data: {"userId": sessionStorage["loginUid"]},
    success: function (data) {
      //var data=JSON.parse(data);
      console.log(data);
      var sum = 0;
      if (data.code < 0) {
        alert("加载购物商品失败，错误原因：" + data.msg);
      } else {
        var html = "";
        $.each(data, function(i,p){
          sum += p.price * p.count; //计算总金额
          html += `
            <div class="goods-item">
              <div class="p-img">
                <a target="_blank" href=""><img src="${p.pic}"></a>
              </div>
              <div class="p-name">
                <a href="" target="_blank">${p.pname}</a>
              </div>
              <div class="p-price">
                <strong class="jd-price">￥${p.price}</strong>
                <span class="p-num">x${p.count}</span>
                <span class="p-state">有货</span>
              </div>
            </div>
          `;
        });
        $(".goods-items").html(html);//修改商品列表
        $('.price-num').html('￥'+sum.toFixed(2)).siblings(':hidden').val(sum); //修改总金额
      }
    },
    error: function () {
      alert("加载购物车商品出错！请检查响应消息");
    }
  });
}
/**功能点4：修改支付方式**/
$('.payment-list').on('click', 'li', function(){
  $(this).addClass('payment-item-selected').siblings('.payment-item-selected').removeClass('payment-item-selected');
  //修改隐藏域的value
  var v = $(this).data('value');//attr('data-value')
  $(this).siblings(':hidden').val(v);
});

/**功能点5：为“提交订单”绑定事件监听**/
$('.checkout-submit').click(function() {
  //收集用户的所有输入——表单序列化
  var data = $('#form-order').serialize();
  data += '&userId=' + sessionStorage['loginUid'];
  console.log(data);
  //异步提交表单数据，实现下单功能
  $.ajax({
    type: "POST",
    url: "data/order_add.php",
    data: data,
    success: function (obj) {
      if (obj.code < 0) {
        alert("订单生成失败，错误消息：" + obj.msg);
      } else {
        sessionStorage["oid"] = obj.oid;
        location.href = "addorder_succ.html";
      }
    },
    error: function () {
      alert("订单提交失败，请检查响应消息");
    }
  });
})