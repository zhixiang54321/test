$("document").ready(function(){
    $("#top").load("data/header.php");
    $("#footer_bottom").load("data/footer.php");
});
$("#bt-login").on("click",function() {
    //var loginUname = null;
    //var loginUid = null;
    var n = $("[name=uname]").val();
    console.log(n);
    var p = $("[name=upwd]").val();
    $.ajax({
        type: "POST",
        url: "data/user_login.php",
        data: {uname: n, upwd: p},
        //dataType:"jsonp",
        success: function (data, msg, xhr) {
            console.log("开始处理响应数据");
            console.log(data);
            var html = "";
            if (data.code === 1) {
                $(".modal").hide();
                $("#welcome").html(`登录成功，欢迎回来：${n}！<a href="#" >[退出]</a>`);
                //loginUname = data.uname;
                //console.log(loginUname);
                //loginUid = data.uid;
                sessionStorage['loginUname']=data.uname;
                sessionStorage['loginUid']=data.uid;
            } else {
                //alert("用户名或密码错误");
                $(".alert").html("用户名或密码错误");
            }
        },
        error: function () {
            alert("1响应失败，请检查Network");
        }
    });
})/**
 * Created by �� on 2017/1/26.
 */
