//页面加载完成后异步请求页头和页脚
//$("document").ready(function(){
	//$("#site_header").load("data/header.php",function(){
	  //$("#welcome").html(`登录成功，欢迎回来：${cookieObject.loginUname}！<a href="#" >[退出]</a> <a href="#" >[重新登录]</a>`);
	//});
	//$("#site_footer").load("data/footer.php");
//});
//var cookieDate=document.cookie;
//console.log(cookieDate);
//功能1读取上一个页面保存的Cookie,获取用户名和ID号
//var cookieArray=document.cookie.split("; ");
//var cookieObject={};
//for(var i=0;i<cookieArray.length;i++){
//	var pair=cookieArray[i].split("=");
//	var key=pair[0];
//	var val=pair[1];
//	cookieObject[key]=val;
//}
//if(!cookieObject.loginUid){//如果不存在用户ID
//	location.href="productlist.html";
//}
if(!sessionStorage["loginUid"]){//客户端内存中没有读取过的Uid
	location.href="Balena_index.html";
}
//功能2页面加载完成后异步请求页头和页脚
$(function(){
	$("#site_header").load("data/header.php",function(){
		$("#welcome").html(`登录成功，欢迎回来：${sessionStorage["loginUname"]}！<a href="#" >[退出]</a>`);
	});
	$("#footer_bottom").load("data/footer.php");
});
//页面加载完后，异步请求当前登录用户的购物车内容
window.onload=function(){
	$.ajax({
		type:"GET",
		url:"data/cart_detail_list.php",
		//data:{"userId":cookieObject.loginUid},
		data:{"userId":sessionStorage["loginUid"]},
		success:function(data){
			//var data=JSON.parse(data);
			console.log(data);
			if(data.code<0){ 
			alert("加载购物商品失败，错误原因："+data[0].pic);
			}else{
				var html="";
				$.each(data,function(i,p){
					console.log(p.price);
					html+=`
						<tr>
						<td>
							<input type="checkbox"/>
							<input type="hidden" value="${p.did}" />
							<div><img src="${p.pic}" alt=""/></div>
						</td>
						<td><a href="#">${p.pname}</a></td>
						<td>${p.price}</td>
						<td data-did='${p.did}'>
							<button class="btndow">-</button><input type="text" value="${p.count}"/><button class="btnup">+</button>
						</td>
						<td><span>￥${p.price*p.count}</span></td>
						<td><a href="${p.did}" class="dele">删除</a></td>
						</tr>
						`;
				});
				$("#cart_products").html(html);
			}
		},
		error:function(){
			alert("加载购物车商品出错！请检查响应消息");
		}
	});

	//为“删除”按钮绑定监听函数，点击后异步请求提交要删除的did，服务器删除成功后，客户端从TABLE中删除当前TR!
	$("#cart_products").on("click","a.dele",function(e){
		e.preventDefault();
		var dele=$(this).attr("href");
		console.log(dele);
		$.ajax({
			type:"POST",
			url:'data/cart_detail_delete.php',
			data:{did:dele},
			success:(data)=>{
				console.log(data);
				//var data=JSON.parse(data);
				console.log(data.code);
				if(data.code<0){
					alert('删除失败！原因：',data.msg);
				}else{
					//$(this).parent().parent().empty();
					$(this).parent().parent().remove();
					alert("删除成功");
				}
			},
			error:function(){
				alert('删除响应出错！');
			}
		});
	});
	//为“+”和“-”按钮绑定监听函数，点击后异步请求提交要did和count，服务器修改成功后，客户端修改购买数量!

}
//为“+”和“-”按钮绑定监听函数，点击后异步请求提交要did和count，服务器修改成功后，客户端修改购买数量!
/*购物车加减*/
$("#cart_products").on('click','.btnup',function(e){
	var count=parseInt($(this).prev().val())+1;
	var did=$(this).parent().attr("data-did");
	$.ajax({
		url:`data/cart_detail_update.php?did=${did}&count=${count}`,
		//data:{did:did,count:count};
		success:(data)=>{
			//var data=JSON.parse(data);
			console.log(data);
			if(data.code==1){
				$(this).prev().val(count);
				var price=parseInt($(this).parent().prev().text());
				var tprice=price*count;
				$(this).parent().next().children().html(tprice);
				//去结算
				jiesuan=parseInt($("#jiesuan").text());
				console.log(jiesuan);
				jiesuan+=tprice;
				$("#jiesuan").html(jiesuan);
			}else{
				alert('增加失败');
			}
		}
	});
});
$("#cart_products").on('click','.btndow',function(e){
	var count=parseInt($(this).next().val());
	if(count>1){
		count-=1;
	}
	var did=$(this).parent().attr("data-did");
	$.ajax({
		url:`data/cart_detail_update.php?did=${did}&count=${count}`,
		success:(data)=>{
			//var data=JSON.parse(data);
			if(data.code==1){
				$(this).next().val(count);
				var price=parseInt($(this).parent().prev().text());
				var tprice=price*count;
				$(this).parent().next().children().html(tprice);
				//去结算
				//var jiesuan=parseInt($("#jiesuan").text());
				//console.log(jiesuan);
				jiesuan-=price;
				$("#jiesuan").html(jiesuan);
			}else{
				alert('增加失败');
			}
		}
	});
});