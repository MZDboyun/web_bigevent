$(function () {
    // 调用方法获取用户基本信息
    getUserInfo()

    var layer = layui.layer

    // 实现点击退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // （1）清空本地存储中的token
            localStorage.removeItem('token')
            // （2）重新跳转到登录页
            location.href = './login.html'


            // 关闭 comfirm 询问框
            layer.close(index);
        });
    })
})


// 定义获取用户信息的方法
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        /*  headers: {
             Authorization: localStorage.getItem('token') || ''
         }, */
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用renderAvatar 渲染用户头像
            renderAvatar(res.data)
        },
        // 不论成功还是失败，都会调用complete回调函数
        /*  complete: function (res) {
             // console.log('ok');
             // console.log(res);
             // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
             if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                 // 1、强制清空token     
                 localStorage.removeItem('token')
                 // 2、强制跳转登录页面
                 location.href = './login.html'
             }
 
 
         } */
    })
}

// 定义渲染用户头像方法
function renderAvatar(user) {
    // 1、获取用户名称
    var uname = user.nickname || user.username
    // 2、设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + uname)
    // 3、按需渲染用户头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2渲染文本头像
        $('.layui-nav-img').hide()
        // 获取用户名称的第一个字符
        var first = uname[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }

}