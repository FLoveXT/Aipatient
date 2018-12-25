var isCheck = false;

var sharecode = "";
var sharepipe = "";
/**
 *  注册方法 
 * */
function OnRegister() {
    var regUser = $(".reg-username").val();
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
    var parments = {
        loginName:regUser,
        phoneNumber: regName,
        passWord: regPass,
        inputCaptcha: regCode,
        shareCode: sharecode,
        channel:sharepipe
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



$(function () {

    
    var code = getQueryString("sid");
    var channel = getQueryString("channel");
    if(code !=null && code.length>0){
        sharecode = code;
    }
    if(channel !=null && channel.length>0){
        sharepipe = channel
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

