$(function () {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间格式的过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 定义补零函数
    function padZero(n) {
        return n < 9 ? '0' + n : n
    }



    // 定义一个查询参数对象q，将来请求数据时，将其提交到服务器
    // 对象q里面有四个属性：页码值，每页数据量，文章分类id，文章状态
    var q = {
        pagenum: 1,//页码值，默认请求第一页数据
        pagesize: 2,//每页数据量,默认两条
        cate_id: '',//文章分类id，默认为空
        state: '',//文章状态，默认为空
    }


    // 调用获取文章列表数据的方法
    initTable()
    // 调用初始化文章分类方法
    initCate()

    // 定义一个获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                layer.msg('获取文章列表成功！')
                console.log(res);
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 定义初始化文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区域的UI结构
                form.render()
            }

        })
    }

    // 为筛选表单绑定submit事件
    $('#form-seach').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选择项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        console.log(cate_id);
        console.log(state);
        // 为查询参数对象q中对应属性赋值
        q.cate_id = cate_id
        q.state = state
        // 重新渲染表格数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',  // 标签的id名，指定区域渲染分页
            count: total,      // 总数据条数
            curr: q.pagenum,	       // 默认哪一页被选中
            limit: q.pagesize,	       // 每页显示的条数 
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 分页发生切换的时候，触发jump回调
            jump: function (obj, first) {
                console.log(first); // true
                //obj包含了当前分页的所有参数
                console.log(obj.curr);

                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到q这个查询参数对象中
                q.pagesize = obj.limit




                // 根据最新的q 获取对应的数据列表，并渲染表格
                // initTable()

                // 判断如果first为true不调用initTable()， 不为true，调用initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮个数
        var len = $('.btn-delete').length

        // 获取到文章的id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 加一个判断，当前页码还有没有内容，没有页码就减一
                    if (len === 1) {
                        // 当点击删除的那一刻，长度为1时，就说明即将删完了，需要页码减1
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    }



                    initTable()
                }
            })

            layer.close(index);
        });
    })
})