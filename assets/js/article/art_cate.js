$(function () {
    initArtCateList()
    function initArtCateList() {
        // 获取文章分类的列表
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败！')
                }
                // 快速渲染页面
                // console.log(res)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    var form = layui.form
    var indexAdd = null;
    var layer = layui.layer
    // 添加新增文章分类失按钮事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layui.layer.open({
            type: 1,      // 页面类型的
            area: ['500px', '250px'],
            title: '添加文章分类'
            // 因为是script标签，所以要识别html标签就需要html（）这个方法；
            , content: $('#dialog-add').html()
        });
    })

    // 必须通过事件委托的形式 为script中的fomr表单绑定事件
    //添加分类文章
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status === 1) {
                    return layui.layer.msg('新增文章分类失败！')
                }
                // form.val('formUserInfo', res.data)也可以
                initArtCateList()
                layui.layer.msg('新增分类成功！')
                // 根据索引关闭对应的弹出层
                layui.layer.close(indexAdd);

            }
        })
    })

    // 必须通过事件委托的形式 为script中的编辑按钮绑定事件
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 先获取被点击的 Id 的值
        var id = $(this).attr("data-Id")
        // console.log(id)
        // 发起请求 获取Id 对应的数据
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)
                form.val('formEdit', res.data)
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    // 修改分类文章
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新分类信息失败！')
                }
                layui.layer.msg('更新分类信息成功！')
                layui.layer.close(indexEdit)
                initArtCateList()
            }
        })
    })


    // 通过代理的形式，为删除分类的表单绑定 click 事件
    $('tbody').on('click', '#btnDelete', function() {
        var id = $(this).attr("data-Id")
        layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        layer.msg('删除分类文章失败！')
                    }
                    layer.msg('删除分类文章成功！')
                    initArtCateList()
                }
            })
            layer.close(index);
          });
    })
})