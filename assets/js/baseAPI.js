// 注意： 每次调用$.get() 或 $.post()或$.ajax()的时候
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = "http://www.liulongbin.top:3007" + options.url


    // 统一为有权限的接口，设置 headers 请求头
    // 判断 url 路径中是否包含 /my 这个路径
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }

    // 全局统一挂载conplete 回调函数
    // $.get() 或 $.post()或$.ajax()无论请求成功还是失败，最后都会调用 complete 这个函数
    options.complete = function (res) {
        // 通过 res 获取 responseJSON这个对象 拿到服务器响应回来的数据
        // console.log(res)
        if (res.responseJSON.status === 1 && res.responseJSON.message ===
            "身份认证失败！") {
            // 强制清空 token
            localStorage.removeItem("token")
            // 强制跳转到登录页面
            return location.href = './login.html'
        }
    }
})