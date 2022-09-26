$(function () {

    var layer = layui.layer
    var form = layui.form

    // 调用获取文章分类列表函数
    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 渲染模板
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var layerclose = null;
    $('#btnAddCate').on('click', function () {
        // 弹出层
        layerclose = layer.open({
            // 改成弹出页面
            type: 1,
            // 改宽高
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        });

    })

    // 通过事件代理的形式，为form-add绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 注意：如果是用的js基本语法需要e.target才能拿到触发事件对象，
            // $(this)是绑定事件对象
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    // return layer.msg('新增分类失败！' + res.message)
                    return console.log(res.message);
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引关闭对应弹出层
                layer.close(layerclose)
            }
        })
    })


    // 通过代理的形式，为btn-edit按钮绑定点击事件
    $('tbody').on('click', '#btn-edit', function () {
        // 修改文章分类的弹出层
        layerclose = layer.open({
            // 改成弹出页面
            type: 1,
            // 改宽高
            area: ['500px', '250px'],
            title: '修改文章分类'
            , content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // 为编辑弹出层表单填数据
                form.val('form-edit', res.data)
            }
        })

    })

    // 通过代理形式，绑定编辑分类弹出层的表单的，submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('编辑文章分类失败！')
                }
                initArtCateList()
                layer.msg('编辑文章分类成功！')
                // 根据索引关闭对应弹出层
                layer.close(layerclose)
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否删除弹出层
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功!')
                    layer.close(index);
                    initArtCateList()
                }
            })

        });
    })
})