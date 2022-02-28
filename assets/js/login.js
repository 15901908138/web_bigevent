$(function () {
    // 点击注册账号的链接
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    // 点击登录的链接
    $("#link_login").on("click", function () {
        $(".reg-box").hide();
        $(".login-box").show();
    })

    // 从 layui 中获取form对象，只要导入了layui.js 就可以使用layui.form类似$("form")
    var form = layui.form
    // layui 消息提示，导入layer
    var layer = layui.layer
    //  通过form.verity()函数自定义效验规则
    form.verify({
        // 自定义了一个pwd效验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
         // 效验两次密码是否一致
        repwd: function(value) {
            // 通过形参获取确认密码框的内容
            // 再获取密码框中的内容
            // 最后进行等于的判断
            // 如果不等，则 return 提示一个消息即可
            var pwd = $(".reg-box [name=password]").val(); //.reg-box [name=password]属性选择器
            if(pwd !== value) {
                return "两次密码不一致"
            }
        }
    })


    // 监听注册表单的提交事件
    $("#form_reg").on("submit", function(e) {
        e.preventDefault()
        var data ={username: $('.reg-box [name=username]').val(), password:$('.reg-box [name=password]').val()}
        // 发起ajax 的 post请求
        $.post("/api/reguser", data, function(res) {
            if(res.status !== 0) {
                // layui消息提示
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录');
            // 模拟人的点击行为
            $("#link_login").click()
        })
    })

    // 监听登录表单的提交事件
    $("#form_login").on("submit", function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            // 快速获取表单内容
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("登录成功")
                // 需要token 才能获取有访问权限的页面
                // 将登录成功得到的 token 字符串保存到localStorage 中；
                // console.log(res.token)
                localStorage.setItem("token", res.token)
                // 跳转到后台主页  
                location.href = "./index.html"
            }
        })
    })
})