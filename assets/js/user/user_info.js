$(function () {
    var form = layui.form
    var layer = layui.layer

    // form.verify函数创建自定义验证规则
    form.verify({
        // 昵称长度在1-6之间
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须1-6个字符之间！'
            }
        }
    })

    // 调用初始化用户信息函数
    initUserInfo()

    // 定义初始化用户基本信息函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
                // 调用 form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault()
        // 重新渲染用户信息
        initUserInfo()

    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起ajax数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')

                }
                layer.msg('更新用户信息成功！')
                // 在子页面中调用父页面的方法，重新渲染用户头像和信息
                window.parent.getUserInfo()
            }
        })

    })
})