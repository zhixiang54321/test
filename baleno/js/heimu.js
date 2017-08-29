/*黑幕左进右出事件*/
window.onload=function(){
    setInterval(zuoyou,2000);
};
function zuoyou(){
    var obj = $('ul.type>li>span.active');
    var spanList = $('ul.type>li>span');
    //console.log(spanList);
    obj.removeClass('active').addClass('leave');
    if(obj.data('i')==spanList.length){
        var next = $(spanList[0]);
        next.css('background-color',color()).addClass('active');
    }else{
        var next = obj.parent().next().children('span');
        next.css('background-color',color()).addClass('active');
    }
    if(obj.data('i')==1){
        $(spanList[spanList.length-1]).removeClass('leave');
    }else{
        var prev = obj.parent().prev().children('span');
//        prev.removeClass('leave');
        prev.css("background-color",'rgba(0,0,0,0)').removeClass('leave');

    }
}
function color(){
    var r = Math.floor(Math.random()*256);
    var g = Math.floor(Math.random()*256);
    var b = Math.floor(Math.random()*256);
    return `rgba(${r},${g},${b},.5)`;
}/**
 * Created by 辰 on 2017/1/25.
 */
