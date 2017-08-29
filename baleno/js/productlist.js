//如果用户没有登录，跳转到登录页面
if(!sessionStorage["loginUid"]){
	location.href="Balena_index.html";
}
//异步请求页头页尾，修改页头中的欢迎消息
$("#site_header").load("data/header.php", function () {
	$("#welcome").html("欢迎回来"+sessionStorage["loginUname"]);
});
$("#footer_bottom").load("data/footer.php");


window.onload=function() {
	//登录异步加载产品（所有）
	//$(function(){
	//$.ajax({
	//type:"GET",
	//url:"data/product_list.php",
	//success:function(data){
	//var html="";
	//$.each(data,function(i,p){
	//html+=`
	//<li>
	//<a href="#"><img src="${p.pic}" alt=""/></a>
	//<p>￥${p.price}</p>
	//<h1><a href="#">${p.pname}</a></h1>
	//<div>
	//<a href="#" class="contrast"><i></i>对比</a>
	//<a href="#" class="p-operate"><i></i>关注</a>
	//<a href="${p.pid}" class="addcart"><i></i>加入购物车</a>
	//</div>
	//</li>`;
	//});
	//$("#plist ul").html(html);
	//},
	//error:function(){
	//alert("2响应失败，请检查Network!");
	//}
	//})
	//})
	//异步加载产品分页
	//$(function(){
	function loadProduct(pno) {
		$.ajax({
			type: "GET",
			url: "data/fenye_product_list.php?pageNum=" + pno,
			success: function (pager) {
				console.log("开始处理分页对象");
				console.log(pager.data);
				var html = "";
				$.each(pager.data, function (i, p) {
					html += `
						 <li>
								<a href="#"><img src="${p.pic}" alt=""/></a>
								<p>￥${p.price}</p>
								<h1><a href="#">${p.pname}</a></h1>
								<div>
									<a href="#" class="contrast"><i></i>对比</a>
									<a href="#" class="p-operate"><i></i>关注</a>
									<a href="${p.pid}" class="addcart"><i></i>加入购物车</a>
								</div>
						</li>`;
				});
				$("#plist>ul").html(html);
			},
			error: function () {
				alert("3响应失败，请检查Network!");
			}
		})
	}

	//构建一个函数
	function loadProductFenye(pno) {
		$.ajax({
			type: "GET",
			url: "data/fenye_product_list.php?pageNum=" + pno,
			success: function (pager) {
				console.log("开始处理分页对象");
				var html = "";
				if (pager.pageNum - 2 > 0) {
					html += `<li><a href="${pager.pageNum - 2}">${pager.pageNum - 2}</a></li>`;
				}
				;
				if (pager.pageNum - 1 > 0) {
					html += `<li><a href="${pager.pageNum - 1}">${pager.pageNum - 1}</a></li>`;
				}
				;
				html += `<li class="active"><a href="${pager.pageNum}">${pager.pageNum}</a></li>`;
				if (pager.pageNum + 1 <= pager.pageCount) {
					html += `<li><a href="${pager.pageNum + 1}">${pager.pageNum + 1}</a></li>`;
				}
				;
				if (pager.pageNum + 2 <= pager.pageCount) {
					html += `<li><a href="${pager.pageNum + 2}">${pager.pageNum + 2}</a></li>`;
				}

				//html+=`<li class="active"><a href="${pager.pageNum}">${pager.pageNum}</a></li>`;
				//for(var i=pager.pageNum;i<=pager.pageCount;i++){
				//html+=`<li><a href="${pager.pageNum+i}">${pager.pageNum+i}</a></li>`;
				//}
				$("ol.pager").html(html);
			},
			error: function () {
				alert("4响应失败，请检查Network!");
			}
		})
	};
	//3根据分页重新构建一个分页条
	$(function () {
		loadProduct(1);
		loadProductFenye(1);
	})

	//4为分页条中超链接绑定监听，实现异步分页详情
	$("ol.pager").on("click", "li a", function (e) {
		e.preventDefault();
		var pno = $(this).attr("href");
		loadProduct(pno);
		loadProductFenye(pno);
	});

	//5为每个商品下面的“添加到购物车绑定监听事件”
	$("#plist").on("click", "a.addcart", function (e) {
		e.preventDefault();
		var pid = $(this).attr("href");
		//把当前登录用户编号+商品编号提交给服务器，执行购买
		$.ajax({
			type: "POST",
			url: "data/cart_detail_add.php",
			data: {"uid": sessionStorage["loginUid"], "pid": pid},
			success: function (data) {
				console.log(data);
				if (data.code < 0) {
					alert("添加失败，错误原因：" + data.msg);
				} else {
					alert("添加成功，该商品已购买数量:" + data.count);
				}
			},
			error: function () {
				alert("添加购物车商品出错！请检查响应消息");
			}
		});

	});

	//6为“去购物车结算”绑定监听
	//$("#settle_up").click(function(){});----不能用此方法，因为异步请求的页头内容都是后面添加的
	$(document.body).on("click", "#settle_up", function () {
		//document.cookie="loginUname="+loginUname;
		//document.cookie="loginUid="+loginUid;
		location.href = "shoppingcart.html";
	});
}

