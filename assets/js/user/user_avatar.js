$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,  // 设置裁剪小框的尺寸比例：16/9  4/3 
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 把input的文件点击事件，让button按钮调用
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    // 更换裁剪区的图片
    $('#file').on('change', function (e) {
        if (e.target.files.length === 0) {
            return layui.layer.msg('请选择相片')
        }
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 根据选择的文件，创建一个对应的 URL 地址：(把文件转换为url路径)
        var newImgURL = URL.createObjectURL(file)
        //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 为确定按钮绑定事件
    $('#btnUpload').on('click', function () {
        // 1.要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 2.调用接口，把头像上传到
            $.ajax({
                method: 'POST',
                url: '/my/update/avatar',
                avatar: dataURL,
                success: function(res) {
                    if(res.status !== 0) {
                        return layui.layer.msg('头像上传失败！')
                    }
                    layui.layer.msg('头像上传成功！')
                    window.parent.getUserInfo()
                }
            })
        })
    })