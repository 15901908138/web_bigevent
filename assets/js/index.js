$(function() {
    // 调用getUserInfo()获取用户信息
    getUserInfo();
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "get",
        url: "/my/userinfo",
        
        // headers 就是请求头 
        // 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },

        success: function(res) {
            if(res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },

        // 无论请求成功还是失败，最后都会调用 complete 这个函数
        // complete: function(res) {
        //     // 通过 res 获取 responseJSON这个对象 拿到服务器响应回来的数据
        //     console.log(res)
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === 
        //         "身份认证失败！") {
        //             // 强制清空 token
        //             localStorage.removeItem("token")
        //             // 强制跳转到登录页面
        //         return location.href = './login.html'
        //     }
        // }
        
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username
    // 2.设置欢迎的文本
    $("#welcome").html("欢迎&nbsp;&nbsp" + name)
    // 3. 按需渲染用户的头像
    if(user.user_pic !== null) {
        // 3.1 渲染图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show()
        $(".text-avatar").hide();
    } else {
        // 3.2 渲染文本头像
        $(".layui-nav-img").hide()
        // 获取用户名首字母要大写
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first).show
    }
}

var layer = layui.layer
// 退出按钮
$("#btnLogout").on("click", function() {
    // 提示用户是否确定退出登录?
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
        //do something
        // 1. 清空token
        localStorage.removeItem("token")
        // 2.重新跳转到登录页面
        location.href = "./login.html"
        // 框架自带的关闭 confirm 询问框
        layer.close(index);
      });
})