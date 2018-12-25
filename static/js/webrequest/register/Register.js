var isCheck = false;

var Code = "";
/**
 *  注册方法 
 * */
function OnRegister() {
    var regName = $(".reg-phone").val();
    var regCode = $(".reg-code").val();
    var regPass = $(".reg-pass").val();

    if (regName.length == 0) {
        errorMsg("请输入注册手机号码")
        return false;
    }
    if (regCode.length == 0) {
        errorMsg("请输入注册验证码")
        return false;
    }
    if (regPass.length == 0) {
        errorMsg("请输入注册密码")
        return false;
    }
    if (isCheck) {
        errorMsg("请勾选服务协议")
        return false;
    }
    var parments = {
        phoneNumber: regName,
        passWord: regPass,
        inputCaptcha: regCode,
        weixinCode: Code
    };
    var json = JSON.stringify(parments);
    new postJsonRequest({
        url: "/api/user/register.json",
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                //设置延时跳转
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

/**
 *  发送微信登授权请求
 * */
function sendWeiXinRequest() {
    YDUI.dialog.confirm('授权提醒', '因业务关系,需要获取微信信息,如果最近已经授权,系统会自动跳过,是否授权?', function () {
        var domain = "http://wx.test.globalyun.com/pages/register.html";
        var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdca1d7833b00b16f&redirect_uri=" + domain + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        window.location.href = url;
    });
}

$(function () {


    var code = getQueryString("code");
    if (isWeiXin()) {
        if (code != "") {
            Code = code;
        }
        else {
            sendWeiXinRequest();
        }
    }

    $(".send-code").click(function () {
        var name = $(".reg-phone").val();
        if (name.length == 0) {
            errorMsg("请输入手机号码");
            return false;
        }
        var parments = {
            phoneNumber: name,
            businessType: 'register'
        };

        new postNoResultRequest({
            url: "/api/user/send_captcha.json",
            isShowLoader: true,
            param:  parments,
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
        },1000);
    }
})

$(function () {
    var isCheck = false;
    //记住密码选择器
    $(".label").click(function () {
        var action = !isCheck;
        if (action) {
            $(".register-btn").removeAttr("disabled");
            $(".check-icon").addClass("active")
            $(".register-btn").addClass("active");

        }
        else {
            $(".register-btn").attr("disabled", "disabled");
            $(".register-btn").removeClass("active");
            $(".check-icon").removeClass("active");
            
        }
        isCheck = !isCheck;
    });
})