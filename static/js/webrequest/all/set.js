// 我的-设置.js

//获取手机号
function getSetInfo() {
    var cacheMobile = localStorage.getItem("username");
    if (cacheMobile == null || cacheMobile == undefined || cacheMobile == "") {
        errorSetTimeOut("获取参数失败,请重新登录", "/pages/login.html");
        return false;
    }
    if (cacheMobile.length == 11) {
        var newPhone = cacheMobile.substr(0, 3) + "****" + cacheMobile.substr(7);
        $(".req-phone").html(newPhone);
    }
    else {
        errorSetTimeOut("获取参数失败,请重新登录", "/pages/login.html");
        return false;
    }
}

/**
 *  退出登录操作
 * */
function loginOut() {
    YDUI.dialog.confirm('退出提醒?', '您确定要退出吗?', function () {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        successSetTimeOut("退出成功","/pages/login.html")
    });
}

$(function () {
     getSetInfo();
})