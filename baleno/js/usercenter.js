//如果用户没有登录，跳转到登录页面
if(!sessionStorage["loginUid"]){
  location.href="productlist.html";
}
//功能2 异步请求页头页尾，修改页头中的欢迎消息
$("#header").load("data/header.php", function () {
  $("#welcome").html("欢迎回来"+sessionStorage["loginUname"]);
});
$("#footer_bottom").load("data/footer.php");
//功能3点击附加导航，实现右侧DIV的切换
$(".affix").on("click","li a",function(e){
  e.preventDefault();
  //修改附加导航中的激活项
  $(this).parent().addClass("active").siblings(".active").removeClass("active");
  //右侧主体内容切换
  var id=$(this).attr("href");
  $(id).addClass("active").siblings(".active").removeClass("active")
});

/**功能点4：页面加载完成，异步请求当前登录用户的订单信息**/
$.ajax({
  url: 'data/my_order.php',
  data: {uid: sessionStorage['loginUid']},
  success: function(list){
    var html = '';
    $.each(list, function(i, order){
      html += `
      <tr><td colspan="6">订单编号：${order.oid}</td></tr>
      <tr>
        <td>
      `;    //遍历订单中的每个商品，对每个商品创建一个<a><img></a>
      $.each(order.products, function(i,p){
        html += `<a href="#"><img src="${p.pic}"></a>`;
      });
      html += `
        </td>
        <td>${order.rcvName}</td>
        <td>
          ￥${order.price}<br>
          <span class="payment">${order.payment}</span>
        </td>
        <td>
          <span class="orderTime">${order.orderTime}</span>
        </td>
        <td>
          <span class="status">${order.status}</span>
        </td>
        <td>
          <a href="#">查看</a><br/>
          <a href="#">评价</a>
          <a href="#">晒单</a><br/>
          <a href="#">还要买</a>
        </td>
      </tr>
      `;
    });
    $('#table-order tbody').html(html);
    //替换表格中的数据——支付方式
    $('#table-order .payment').each(function(i,span){
      if(span.innerHTML === '1'){
        span.innerHTML = '货到付款';
      }else if(span.innerHTML === '2'){
        span.innerHTML = '微信支付';
      }else if(span.innerHTML === '3'){
        span.innerHTML = '在线支付';
      }else if(span.innerHTML === '4'){
        span.innerHTML = '手机支付';
      }
    });
    //替换表格中的数据——下单时间
    $('#table-order .orderTime').each(function(i,span){
      var t = span.innerHTML;
      t = parseInt(t);
      t = new Date(t);  //把整数转换为Date对象
      span.innerHTML = t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate()+'<br>'+t.getHours()+':'+t.getMinutes();
    });
    //替换表格中的数据——订单状态
    $('#table-order .status').each(function(i,span){
      if(span.innerHTML === '1'){
        span.innerHTML = '等待付款';
      }else if(span.innerHTML === '2'){
        span.innerHTML = '发货中';
      }else if(span.innerHTML === '3'){
        span.innerHTML = '已收款';
      }else if(span.innerHTML === '4'){
        span.innerHTML = '废单';
      }
    });
  },
  error: function(){
    alert('我的订单请求失败！请求检查响应消息')
  }
});


/**功能点5：页面加载完，异步请求当前用户的消费统计数据，绘制原生的SVG统计图**/
$.ajax({
  url: 'data/buy_stat.php',
  data: {uid: sessionStorage['loginUid']},
  success: function(list){
    //根据服务器端返回的数据绘制SVG统计图
    var w = 800;  //画布的宽
    var h = 500;  //画布的高
    $('#svg-buy-stat').attr('width',w).attr('height',h);

    var barWidth = w/(2*list.length+1); //每个柱子的宽度
    var maxValue = list[0].value;  //所有金额中的最大值
    for(var i=1; i<list.length; i++){
      if(list[i].value>maxValue){   //获取所有值中的最大值
        maxValue = list[i].value;
      }
    }
    var html = '';
	var htmlEffects="";
	var htmlwz="";
	var htmlvalue="";
    $.each(list, function(i,month){
      var bw = barWidth; //每个柱子的宽
      var bh = h*month.value/maxValue; //每个柱子的高，比例尺问题
      var bx = (2*i+1)*barWidth; //每个柱子定位点的X
      var by = h-bh; //每个柱子定位点的Y
	  var c=rc();//颜色
      html += `
      <rect fill="url(#g${i})" width="${bw}" height="0" data-full-height="${bh}" x="${bx}" y="${by}"></rect>
      `;
	  htmlEffects+=`
	  <linearGradient id="g${i}" x1="0" y1="0" x2="0" y2="100%">
		<stop offset="0" stop-color="${c}" stop-opacity="1"></stop>
		<stop offset="1" stop-color="${c}" stop-opacity="0"></stop>
	  </linearGradient>
      `;
	  htmlwz+=`
      <text x="${bx}" y="490" >${month.label}</text>
      `;
	  htmlvalue+=`
		<text x="${bx}" y="${by+10}">${month.value}</text>	
	  `;
    });
    $('#svg-buy-stat g').html(html);
	$('#barEffect').html(htmlEffects);
	$('#wz').html(htmlwz);
	$('#val').html(htmlvalue);
    //启动定时器，让每个柱子的高度逐渐变大，直至达到full-height
    setInterval(function(){
      $('#svg-buy-stat g rect').each(function(i,rect){
        var ch = $(rect).attr('height'); //当前高度
        ch = parseFloat(ch);
        ch++;
        var fh = $(rect).data('fullHeight');  //完整高度
        fh = parseFloat(fh);
        if(ch<=fh) {  //当前高度尚未达到完整高度，则继续变高
          $(rect).attr('height', ch);
          $(rect).attr('y', h-ch);
        }
        ///TODO: 使用一个计数器记录已到完整高度的柱子数量，若总数已到12个，则清除定时器
      });
    },6)
  }
});

  function rc(){
    var r=parseInt(Math.random()*256);
    var g=parseInt(Math.random()*256);
    var b=parseInt(Math.random()*256);
    return `rgb(${r},${g},${b})`;
  }
/**功能点6：页面加载完成，异步请求当前用户的消费统计记录，使用FusionCharts工具绘制统计图**/
$.ajax({
  url: 'data/buy_stat.php',
  data: {uid: sessionStorage['loginUid']},
  success: function(list){
    //开始使用FusionCharts绘制统计图
    var c = new FusionCharts({
      type: 'doughnut2d',//'doughnut3d',//'pie2d',//'bar3d',//'bar2d',//'column3d',//'column2d',
      renderAt: 'buy-stat-fc',
      width: "800",
      height: "500",
      dataSource: {
        data: list    //[{label:xx, value:xx}]
      }
    });
    c.render(); //将图表内容渲染出来
  }
});
/**功能点7：页面加载完后，异步请求当前登录用户的抽奖统计信息**/
$.ajax({
  url: 'data/lottery_stat.php',
  data: {uid: sessionStorage['loginUid']},
  success: function(obj){
    if(obj.used>=obj.total){
      $('#bt-lottery').html(`无法抽奖(总抽奖次数：${obj.total}，剩余抽奖次数：${obj.total-obj.used})`);
      return;
    }
    $('#bt-lottery').html(`开始抽奖(总抽奖次数：${obj.total}，剩余抽奖次数：${obj.total-obj.used})`);

    /**加载抽奖必须的图片-圆盘、指针**/
    var progress = 0;
    var imgPan = new Image();
    imgPan.src = 'img/pan.png';
    imgPan.onload = function(){
      progress += 80;
      if(progress===100){
        drawLottery();
      }
    }
    var imgPin = new Image();
    imgPin.src = 'img/pin.png';
    imgPin.onload = function(){
      progress += 20;
      if(progress===100){
        drawLottery();
      }
    }
    var w = 0;
    var h = 0;
    var ctx = null;
    //绘制静止的抽奖界面
    function drawLottery(){
      console.log('两张必需的图片加载完成，开始绘制抽奖界面')
      w = imgPan.width;
      console.log(w);
      h = imgPan.height;
      var canvas = document.getElementById('canvas-lottery');
      canvas.width = w;
      canvas.height = h;
      ctx = canvas.getContext('2d');
      ctx.drawImage(imgPan, 0, 0);
      ctx.drawImage(imgPin, w/2-imgPin.width/2, h/2-imgPin.height/2);
      //启用抽奖按钮，为其绑定“一次点击事件”监听
      $('#bt-lottery').prop('disabled', false).one('click', function(){
        console.log('开始抽奖');
        startLottery();
      });

    }
    //绘制动态的抽奖效果
    function startLottery(){
      var deg = 0;  //圆盘当前已经旋转的角度
      var last = 0; //圆盘当前已经旋转的时长(毫秒)
      var duration = Math.random()*5000+4000; //圆盘旋转的总时长(毫秒，随机数)
      var timer = setInterval(function(){
        //无需清除画布，因为圆盘每次绘制会覆盖之前的内容
        //画笔旋转之后绘制圆盘
        ctx.save();
        ctx.translate(w/2, h/2); //平移画布的原点
        ctx.rotate(deg*Math.PI/180); //画笔旋转
        ctx.drawImage(imgPan, -w/2,-h/2);
        ctx.restore();

        //未旋转的状态下绘制指针
        ctx.drawImage(imgPin, w/2-imgPin.width/2,h/2-imgPin.height/2);

        //统计旋转的数据
        deg += 3;   //3就是每10毫秒旋转的角度
        deg %= 360; //370的旋转效果等同于10
        last += 10;
        if(last>=duration){ //已经旋转的时长达到了预定的总时长
          clearInterval(timer);
          ///TODO: 计算旋转角度，得到所获奖项，异步提交给服务器
          ///TODO: 让旋转先加速，再减速，最后慢慢停止
        }
      },10);
    }

  }
});


