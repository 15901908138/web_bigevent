$(function () {
    var layer = layui.layer
    var form = layui.form

    // 初始化富文本编辑器
    initEditor()

    // 动态获取文章分类列表
    // 定义文章分类的方法
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                // 渲染文章分类
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 因为select 内容为空，无法被layui 解析，所以需要用form.render方法重新解析；
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 1,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面绑定点击事件,让其触发文件选择点击事件
    $('#btnImageChoose').on('click', function () {
        $('#file').click();
    })

    // 监听file 的change 事件，获取用户选择的文件
    $('#file').on('change', function (e) {
        // 获取文件的列表数组
        var files = e.target.files
        // 判断用户是否选了文件
        if (files.length === 0) {
            return layer.msg('请选择相片!')
        }
        // 根据文件创建对应的URL 地址（就是把文件解析为字符串的地址）
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置相片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态  
    var art_state = '已发布'

    //  为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定submit事件 （获取请求体title, cate_id, content）
    $('#form-pub').on('submit', function (e) {
        // 阻止表单默认的提交行为
        e.preventDefault()
        //基于表单，快速创建一个 formData 对象
        // $(this)[0]需要把表单转换为DOM元素，获取表单 键和值
        var fd = new FormData($(this)[0])
        // 将文章的发布状态存到fd 中  （获取请求体state）
        fd.append('state', art_state)
        //获取表单 键和值
        // fd.forEach(function(v,k) {
        //     // v是值，k是键
        //     console.log(k,v)
        // })

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)  //（获取请求体cover_img）

                // 请求体需要携带的所有参数已经都拿到了，发起ajax请求 发布文章；
                publishArticle(fd)
            })
    })
    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的数据是fomrDate格式，必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章失败！')
                // 成功之后跳转的文章列表页面
                location.href = '../article/art_list.html'
            }
        })
    }
})