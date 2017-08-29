uname.onblur = function(){
  if(this.validity.valueMissing){
    var msg = '用户名不能为空';
    this.nextElementSibling.innerHTML = msg;
    this.nextElementSibling.className = 'help-block danger';
    this.setCustomValidity(msg);
  }else if(this.validity.tooShort){
    var msg = '用户名长度不能少于3位';
    this.nextElementSibling.innerHTML = msg;
    this.nextElementSibling.className = 'help-block danger';
    this.setCustomValidity(msg);
  }else {
    var msg = '用户名格式合法';
    this.nextElementSibling.innerHTML = msg;
    this.nextElementSibling.className = 'help-block success';
    this.setCustomValidity('');
  }
};
upwd.onblur=function(){
  if(this.validity.valueMissing){
    var msg='密码不能为空';
    this.nextElementSibling.innerHTML=msg;
    this.nextElementSibling.className='help-block danger';
    this.setCustomValidity(msg);
  }else if(this.validity.tooShort){
    var msg='密码长度不能少于6位';
    this.nextElementSibling.innerHTML=msg;
    this.nextElementSibling.className='help-block danger';
    this.setCustomValidity(msg);
  }else if(this.validity.tooLong){
    var msg='密码长度不能长于12位';
    this.nextElementSibling.innerHTML=msg;
    this.nextElementSibling.className='help-block danger';
    this.setCustomValidity(msg);
  }else{
    var msg = '密码格式合法';
    this.nextElementSibling.innerHTML = msg;
    this.nextElementSibling.className = 'help-block success';
    this.setCustomValidity('');
  }
}

/**功能点1：为“提交”按钮绑定事件监听**/
$('.bt-submit').click(function(e){
  //表单序列化
  e.preventDefault();
  var data = $('#form-register').serialize();
  console.log(data);  //k=v&k=v

  //发起异步AJAX请求
  $.ajax({
    type: 'POST',
    url: 'data/register.php',
    data: data,
    success: function(obj){
      console.log(obj);
      if(obj.code<0){
        alert('注册失败！错误原因：'+obj.msg);
      }else {
        alert('注册成功！3s后将自动跳转到登录页面...')
        setTimeout(function(){
          location.href = '../index.html';
        }, 3000);
      }
    },
    error: function(){
      alert('异步请求有误！请检查响应消息！')
    }
  });
});