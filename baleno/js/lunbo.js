////lunbo
//$("div.photos").ready(function(){
////利用数组和定时器制作图片轮播效果
//	var curIndex=0;
//	var timeInterval=2000;//每两秒轮播一张图
//	var arr=new Array();
//	arr[0]="images/top.jpg";
//	arr[1]="images/top1.jpg";
//	arr[2]="images/top2.jpg";
//	//arr[3]="images/top1.jpg";
//	setInterval(changeImg,timeInterval);//启动定时器
//	function changeImg(){
//		var obj=document.getElementById("obj");
//		if(curIndex===arr.length-1){
//			curIndex=0;
//		}else{
//			curIndex+=1;
//		}
//		obj.src=arr[curIndex];
//	}
//})

/*广告图片数组*/
var imgs=[
	{"i":0,"img":"images/top.jpg"},
	{"i":1,"img":"images/top1.jpg"},
	{"i":2,"img":"images/top2.jpg"},
	//{"i":3,"img":"images/index/banner_04.jpg"},
	//{"i":4,"img":"images/index/banner_05.jpg"},
];
var slider={
	LIWIDTH:0,//一张广告的宽度
	$imgs:null, $idxs:null,//保存ul imgs和ul indexs
	DURATION:1000,//每次轮播的时间
	WAIT:4000,//每次轮播之间的等待时间
	timer:null,//保存自动轮播的定时器序号
	init(){//初始化:
		//获得id为slider的div的宽保存在LIWIDTH中
		this.LIWIDTH=parseFloat(
			$("#slider").css("width"));
		//获得id为imgs的ul保存在$imgs中
		this.$imgs=$("#imgs");
		//获得id为indexs的ul保存在$idxs中
		this.$idxs=$("#indexs");
		this.updateView();//更新页面
		this.startAuto();//启动自动轮播
		//为$idxs添加鼠标进入事件委托，只允许li元素响应
		this.$idxs.on("mouseover","li",e=>{
			if(!$(e.target).hasClass("hover")){
				//停止一次性定时器
				clearTimeout(this.timer); this.timer=null;
				this.$imgs.stop(true);
				//找到$idxs下class为hover的li，获取其内容保存在start
				var start=
					this.$idxs.children(".hover").html();
				//获得当前li的内容保存在end
				var end=$(e.target).html();
				//调用move,传入end-start
				this.move(end-start);
			}
		})
	},
	updateView(){//根据数组更新页面
		//遍历imgs中每个对象,同时定义空字符串imgsHTML和idxsHTML
		for(var i=0,imgsHTML="",idxsHTML="";
			i<imgs.length;
			i++){
			imgsHTML+=//向imgsHTML中拼接:
				`<li><img src="${imgs[i].img}"/></li>`
			//向idxsHTML中拼接:
			idxsHTML+=`<li>${i+1}</li>`;
		}//(遍历结束)
		//设置$imgs的内容为imgsHTML
		//设置$imgs的宽为imgs数组的元素个数*LIWIDTH
		this.$imgs
			.html(imgsHTML)
			.css("width",imgs.length*this.LIWIDTH);
		//设置$idxs的内容为idxsHTML
		this.$idxs.html(idxsHTML);
		//获得数字imgs中第0个元素的i属性保存在i中
		//为$idxs下第i个子元素添加hover class
		this.$idxs.children(`:eq(${imgs[0].i})`)
			.addClass("hover");
	},
	startAuto(){//启动自动轮播
		//启动周期性定时器,调用move,传入1
		this.timer=setTimeout(
			()=>this.move(1),this.WAIT);
	},
	move(n){//启动轮播
		if(n>0){//小到大
			//$imgs的left在DURATION时间内移动到-n*LIWIDTH
			this.$imgs.animate({
				left:-n*this.LIWIDTH
			},this.DURATION,()=>{
				//删除imgs数组开头的n个元素，拼接到结尾
				imgs=imgs.concat(imgs.splice(0,n));
				this.updateView();//更新界面
				this.$imgs.css("left",0);//清除$imgs的left
				this.startAuto();//重新启动自动轮播
			});
		}else{//大到小
			n*=-1;//n*-1
			//删除imgs结尾的n个元素, 拼接到开头
			imgs=imgs.splice(-n,n).concat(imgs);
			this.updateView();//更新页面
			//修改$imgs的left-n*LIWIDTH
			var left=parseFloat(this.$imgs.css("left"));
			this.$imgs.css("left",left-n*this.LIWIDTH);
			//启动动画，让$imgs的left在DURATION时间内移动到0,移动后,再次启动自动轮播
			this.$imgs.animate(
				{left:0},
				this.DURATION,
				()=>this.startAuto()
			);
		}
	}
};
slider.init();
