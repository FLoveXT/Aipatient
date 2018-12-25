
var is_index = 0;
var is_doctor = 0;
var is_recipe = 0;
var is_my = 0;
$(function () {
    if (isWeiXin()) {
        $("header").remove();
        $("body").addClass("active");
    }

    var linkUrl = window.location.href;
    if (linkUrl.indexOf("/pages/diagnose/ai_detail.html?recordId=") > -1 || linkUrl.indexOf("/pages/diagnose/detail.html?recordId=") > -1) {

    } else {
        window.nim = {};
    }
    $(".prev-icon").click(function () {
        if ($(this).hasClass("if-ai")) {
            return false;
        }
        var urlreffer = document.referrer;
        if (urlreffer == null || urlreffer == "" || urlreffer == undefined) {
            window.location.href = "/";
        }
        else {
            window.history.back(-1);
        }
    })

    var footerBody = '<div class="pb80"></div> <div class="footer-info"><a href="/" class="icon01">首页</a> <a class="icon02" href="/pages/users/inquiry.html">看病</a><a class="icon03" href="/pages/nostrum/list.html">秘方</a> <a class="icon04" href="/pages/users/my.html">我的</a></div>';

    $("body").append(footerBody);
})

/**
 *  获取GET中的URL参数
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return "";
}

/**
 *  启用滚动条
 * */
function EabledScroll() {
    $(document.body).css({
        "overflow-x": "auto",
        "overflow-y": "auto"
    });
}

/**
 *  禁用滚动条
 * */
function DisabledScroll() {
    $(document.body).css({
        "overflow-x": "hidden",
        "overflow-y": "hidden"
    });
}

//判断是否微信登陆
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}


//写cookies 
function setCookie(name, value) {
    var days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
}

//读取cookies 
function readCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }

}

//删除cookies 
function delCookie(name) {
    var cval = readCookie(name);
    if (cval != null) {
        document.cookie = name + "=;path=/;expires=" + (new Date(0)).toGMTString();
    }
}

/**
 * 获取URL -1
 * @param {any} name
 */
function getUrl1(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
} 

/**
 * 获取URL -2
 * */
function getUrl2() {
    var url = location.search; //获取url中"?"符后的字串  
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}  

/** 
 * 获取指定的URL参数值 
 * URL:http://www.quwan.com/index?name=tyler 
 * 参数：paramName URL参数 
 * 调用方法:getParam("name") 
 * 返回值:tyler 
 */
function getUrl3(paramName) {
    paramValue = "", isFound = !1;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
    }
    return paramValue == "" && (paramValue = null), paramValue
} 

function zoomInfo() {
    $('#id').FlyZommImg({
        rollSpeed: 200,//切换速度
        miscellaneous: true,//是否显示底部辅助按钮
        closeBtn: false,//是否打开右上角关闭按钮
        hideClass: 'hide',//不需要显示预览的 class
        imgQuality: 'original',//图片质量类型  thumb 缩略图  original 默认原图
        slitherCallback: function (direction, DOM) {//左滑动回调 两个参数 第一个动向 'left,firstClick,close
        }
    });
}