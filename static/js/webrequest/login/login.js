var verfCode = "";
var Code = "";
$(function () {
    var code = getQueryString("code");


    verfCode = new GVerify("verf-div");
    if (isWeiXin()) {
        if (code != "") {
            Code = code;
        }
        else {
            sendWeiXinRequest();
        }   
    }

})

/**
 *  发送微信登授权请求
 * */
function sendWeiXinRequest() {
    YDUI.dialog.confirm('授权提醒', '因业务关系,需要获取微信信息,如果最近已经授权,系统会自动跳过,是否授权?', function () {
        var domain = "http://www.5aszy.com/pages/login.html";
        var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdca1d7833b00b16f&redirect_uri=" + domain + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        window.location.href = url;
    });   
}

/**
 *  登录方法
 */
function OnLogin() {
    var loginName = $(".login-name").val();
    var loginPassword = $(".login-pass").val();
    var loginCode = $(".login-code").val();
    if (loginName.length == 0) {
        errorMsg("请输入手机号码")
        return false;
    }
    if (loginPassword.length == 0) {
        errorMsg("请输入密码")
        return false;
    }
    if (loginCode.length == 0) {
        errorMsg("请输入验证码")
        return false;
    }
    if (!verfCode.validate(loginCode)) {
        $(".login-code").val("");
        errorMsg("验证码输入错误")
        return false;
    }

    var parments = {
        loginName: loginName,
        passWord: loginPassword,
        clientType: "WEIXIN",
        weixinCode: Code
    };
    var json = JSON.stringify(parments)

    new postLoginJsonRequest({
        url: "/api/user/login.json",
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                //存储token
                localStorage.setItem("token", res.token)
                localStorage.setItem("username", loginName)
                //设置延时跳转
                successSetTimeOut(res.message, "/index.html");
                return false;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}


$(function () {
    var isCheck = false;
    //记住密码选择器
    $(".check-info").click(function () {
        var action = !isCheck;
        if (action) {
            $(".check-icon").removeClass("active")
        }
        else {
            $(".check-icon").addClass("active")
        }
        isCheck = !isCheck;
    });

    $(".footer-info").remove();
    $("body").addClass("active");
})