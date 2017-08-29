var elevator={
  FHEIGHT:0,//保存楼层高度
  UPLEVEL:0,//保存亮灯区域的上限
  DOWNLEVEL:0,//保存亮灯区域的下限
  $spans:null,//保存每个楼层的灯span
  $elevator:null,//保存电梯按钮的div
  DURATION:1000,
  init(){
    var me=this;//留住this
    //获得class为floor的元素的高保存在height
    var height=
      parseFloat($(".floor").css("height"));
    console.log(height);
    //获得class为floor的元素的marginBottom保存在bottom
    var bottom=
      parseFloat($(".floor").css("marginBottom"));
    console.log(bottom);
    //计算FHEIGHT: height+bottom
    me.FHEIGHT=height+bottom;
    //计算UPLEVEL: (innerHeight-FHEIGHT)/2
    me.UPLEVEL=(innerHeight-me.FHEIGHT)/2;
    //计算DOWNLEVEL: UPLEVEL+FHEIGHT;
    me.DOWNLEVEL=(me.UPLEVEL+me.FHEIGHT);
    //获得class为floor下的header下的span保存在$spans
    me.$spans=$(".fl");
    //获得id为elevator的div保存在$elevator中
    me.$elevator=$("#elevator");
    //为当前页面绑定滚动事件
    $(document).scroll(e=>{
      //获得页面滚动过的高度
      var scrollTop=$(e.target).scrollTop();
      //对$spans中每个span执行相同操作
      me.$spans.each(i=>{
        //获得$spans下i位置的span
        var $span=me.$spans.eq(i);
        //获得当前span距body顶部的offsetTop
        var offsetTop=$span.offset().top;
        //计算innerTop: offsetTop-scrollTop
        var innerTop=offsetTop-scrollTop;
        //如果innerTop<=DOWNLEVEN&&>UPLEVEL
        if(innerTop<=me.DOWNLEVEL
            &&innerTop>me.UPLEVEL){
          //为当前span添加hover class
          $span.addClass("hover");
        }else{//否则
          //为当前span移除hover class
          $span.removeClass("hover");
        }
      });
      //如果有hover的span，
        //为$elevator添加in class
      //否则
        //为$elevator移除in class
      if(me.$spans.hasClass("hover")){
        me.$elevator.addClass("in");
        //将$elevator下第一个a显示，第二个a隐藏
        me.$elevator
            .find("a:first-child")
            .css("display","block");
        me.$elevator
            .find("a:last-child")
            .css("display","none");
        //获得当前被选中的span
        var $span=me.$spans.filter(".hover");
        if($span.size()>0){//如果找到
          //获得$span在$spans中的位置
          var i=me.$spans.index($span);
          console.log(i);
          //获得elevator下i位置的li
          var $li=
            me.$elevator.find(`li:eq(${i})`);
          //将$li下第一个a隐藏，第二个a显示
          $li.children(":first")
              .css("display","none")
             .next().css("display","block");
        }
      }else
        me.$elevator.removeClass("in");
    });

    //为$elevator下的每个li绑定hover
      //移出: 如果对应的span没有亮灯
              //才第一个a显示，第二个a隐藏
    me.$elevator.find("li").hover(
      function(){//进入: 第一个a隐藏，第二个a显示
        $(this).children(":first")
                .css("display","none")
               .next().css("display","block");
      },
      function(){
        //获得当前li在$elevator下的位置i
        var i=me.$elevator
                  .find("li").index(this);
        //如果$spans中i位置的span没有hover
        if(!me.$spans.eq(i).hasClass("hover"))
          $(this).children(":first")
                      .css("display","block")
                    .next().css("display","none");
      }
    );
    //为$elevator添加单击事件代替,只允许ul下的li下的最后一个a响应
    me.$elevator.on("click","ul>li>a:last-child",
      function(){
        //获得当前a在$elevator所有第二个a中的位置i
        var i=
          $(this).index("#elevator a:last-child");
        //获得spans中i位置的span的offsetTop
        var offsetTop=me.$spans.eq(i).offset().top;
        //计算scrollTop: offsetTop-UPLEVEL
        var scrollTop=offsetTop-me.UPLEVEL;
        $("body").stop(true);
        $("body").animate({
          scrollTop:scrollTop
        },me.DURATION);
    });
  }
}
elevator.init();