$(function () {

    var layer = layui.layer
    var form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 一定要记得调用form.render()方法
                form.render()

            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile 的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取文件的列表数组
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        // 根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0])
        console.log(newImgURL);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'
    // 为存在草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0])

        // 将文章的发布状态，存到fd中
        fd.append('state', art_state)



        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到fd中
                fd.append('cover_img', blob)

                /*  fd.forEach(function (v, k) {
                     console.log(k, v);//title 11
                     // art_pub.js: 77 cate_id 1
                     // art_pub.js: 77 content < p > 11</p >
                 }) */

                // 发起ajax请求
                publishArticle(fd)
            })
    })


    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意，如果向服务器提交的是FormData格式数据
            // 必须提交以下两个配置项
            // 不修改 Content-Type 属性，使用 FormData 默认的 Content-Type 值
            contentType: false,
            // 不对 FormData 中的数据进行 url 编码，而是将 FormData 数据原样发送到服务器
            // 这个processData默认是true，表示转为对象，这里不做处理，为false
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    // return layer.msg('发布文章失败！')
                    return console.log(res.message);
                }
                layer.msg('发布文章成功！')
                // 如果文章发布成功，页面跳转至文章列表
                // location.href = '/4.8 大事件后台管理系统项目/code1 大事件后台管理项目/article/art_list.html'
                location.href = './art_list.html'


            }
        })
    }

})