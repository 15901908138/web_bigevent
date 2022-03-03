$(function() {
    // <!-- 这是自己写的查问题 -->
    // 表单验证
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            value = value.trim();
            if(value.length > 6){
                return "昵称长度必须在1~6个字符之间！"
            }
        }
    })
    // 调用初始化
    InitUserInfo()

    // 初始化用户信息
    function InitUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res)
                // 调用 form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单数据
    $('#btnReset').on('click', function(e) {
        // 阻止默认的重置行为
        e.preventDefault();
        // 重新渲染表单
        InitUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止默认行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面的 方法，重新渲染用户的头像和用户的信息
                // $(window).parent.getUserInfo()
                window.parent.getUserInfo()
                
            }
        })
    })
})