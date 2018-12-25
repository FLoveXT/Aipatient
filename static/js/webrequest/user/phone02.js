//获取验证码
var $getCode = $('#J_GetCode');

function getVeryNum() {
    new postRequest({
        url: "/api/user/send_captcha.json",
        isShowLoader: true,
        param: {
            "phoneNumber": $("#phone_num").val(),
            "businessType": "reset_phone"
        },
        callBack(res) {
            if (res.code == 200) {
                YDUI.dialog.loading.open('发送中');
                setTimeout(function () {

                    YDUI.dialog.loading.close();
                    $getCode.sendCode('start');

                    YDUI.dialog.toast('已发送', 'success', 1500);

                }, 1500);
            } else {
                errorMsg(res.message)
                return false
            }

        }
    })
}

function saveEvent() {
    var params = {
        "phoneNumber": $("#phone_num").val(),
        "inputCaptcha": $("#verfiy_code").val(),
        "lastStepCode": getQueryString("code")
    }
    new putJsonRequest({
        url: "/api/user/reset_phone_number.json",
        isShowLoader: true,
        param: JSON.stringify(params),
        callBack(res){
            if(res.code==200){
                successSetTimeOut(res.message,"/pages/users/my.html")
            }
            console.log(res)
        }
    })
}