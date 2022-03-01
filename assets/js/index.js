$(function () {
    // 调用获取用户的基本信息
    getUserInfo()

    var layer = layui.layer
    // 退出功能
    $("#btnLogout").on("click", function () {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清空token
            localStorage.removeItem("token")
            // 重新跳转页面
            location.href = "./login.html"
            layer.close(index);
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // 获取带有访问权限的路径必须设置请求头
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败")
            }
            // console.log(res);

            // 调用渲染头像函数
            renderAvatar(res.data)
        },
        
        // ajax 不论请求成功或者失败都会调用complete这个函数
        // complete: function(res) {
        //     console.log(res)
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //强制清空token
        //         localStorage.removeItem("token")
        //         // 强制跳转登录页面
        //         location.href = './login.html'
        //     }
        // }
    })
}


// 渲染头像函数
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
    // 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show()
        $(".text-avatar").hide();
    } else {
        // 渲染文本头像
        $(".layui-nav-img").hide()
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first).show()
    }

}



