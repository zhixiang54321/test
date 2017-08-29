$("#bt-login").on("click",function(){
    //异步加载产品/**
    $(function(){
        //function loadProduct(pno){
        $.ajax({
            type:"GET",
            //url:"data/fenye_product_list.php?",
            success:function(){
                console.log("开始处理分页对象");
                var html="";
                //$.each(pager.data,function(i,p){
                    html+=`
                    <p class="left">
                        <img src="images/TB2GsrVb4vzQeBjSZFAXXaF9VXa_!!2456386471.jpg">
                        <a href="#"><img src="images/TB2FzfQbV_AQeBjSZFyXXb1bXXa_!!2456386471.jpg"></a>
                    </p>
                    <p class="right">
                        <img src="images/TB277LQbV_AQeBjSZFyXXb1bXXa_!!2456386471.jpg">
                        <a href="#"><img src="images/TB2pxvObV6AQeBjSZFIXXctXpXa_!!2456386471.jpg"></a>
                    </p>
                    <div class="clear"></div>
                    <h3>
                        摇粒绒&nbsp;布绒连帽卫衣&nbsp;&nbsp;<b>&yen;169</b>
                        <span>连帽短款羽绒服&nbsp;个性拼接&nbsp;&nbsp;<b>&yen;199</b></span>
                    </h3>
                    `;
                //});
                $("#main_center").html(html);
            },
            error:function(){
                alert("3响应失败，请检查Network!");
            }
        })
    })
})
