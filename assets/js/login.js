// 入口函数
$(function () {

    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录账号的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取 form对象
    var form = layui.form
    var layer = layui.layer
    // var baseAPI = 'http://www.liulongbin.top:3007'
    // 通过调用form.verify(）这个函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return提示信息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) return '两次密码不一致'
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message);
            }
            // console.log('注册成功');
            // console.log(res.message);
            layer.msg('注册成功,请登录!');
            // 模拟点击行为，点击去登录按钮
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
                console.log(res.token);
                //将登录成功的token字符串，保存到localStorage里面
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = './index.html'
            }
        })

    })

})