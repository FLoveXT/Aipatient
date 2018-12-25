var find = {

};


$(function () {
    $(".footer-info").remove();
    $("body").addClass("active");

    $(".send-code").click(function () {
        var name = $(".reset-mobile").val();
        if (name.length == 0) {
            errorMsg("请输入手机号码");
            return false;
        }
        var parments = {
            phoneNumber: name,
            businessType: 'reset'
        };

        new postRequest({
            url: "/api/user/send_captcha.json",
            isShowLoader: true,
            param: parments,
            callBack(res) {
                if (res.code == 200) {
                    setTime();
                }
                else {
                    errorMsg(res.message);
                    return false;
                }
            }
        })
    });

    var _code = 120;
    var that = $(".send-code");
    function setTime() {
        if (_code == 0) {
            that.attr("disabled", false);
            that.text("获取验证码")
            _code = 120;
            return false;
        }
        else {
            that.attr("disabled", true);
            that.text("(" + _code + "秒)");
            _code--;
        }
        setTimeout(function () {
            setTime();
        }, 1000);
    }
})

function reSetModify() {
    var reset_mobile = $(".reset-mobile").val();
    var reset_code = $(".reset-code").val();
    var reset_pwd = $(".reset-pwd").val();
    var reset_re_pwd = $(".reset-repwd").val();

    if (reset_mobile.length == 0) {
        errorMsg("请输入手机号码")
        return false;
    }
    if (reset_code.length == 0) {
        errorMsg("请输入验证码")
        return false;
    }
    if (reset_pwd.length == 0) {
        errorMsg("请输入密码")
        return false;
    }
    if (reset_re_pwd.length == 0) {
        errorMsg("请输入确认密码")
        return false;
    }
    if (reset_pwd != reset_re_pwd) {
        errorMsg("两组密码输入不一致")
        return false;
    }
    var parments = {
        phoneNumber: reset_mobile,
        passWord: reset_pwd,
        inputCaptcha: reset_code,
    };

    var json = JSON.stringify(parments);
    new putJsonRequest({
        url: "/api/user/reset_password.json",
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                successSetTimeOut(res.message, "/pages/login.html");
                return false;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}