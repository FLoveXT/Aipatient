
/**
 *  错误提示框
 */
function errorToast(msg) {
    layer.alert(msg, {
        time: 3000,
        icon: 5,
        title: "错误提醒!"
    })
    return false;
}

/**
 *  成功提示框
 */
function successToast(msg) {
    layer.alert(msg, {
        time: 3000,
        icon: 6,
        title: "成功提醒!"
    })
    return false;
}

/**
 *  加载中,默认时长为false,代码关闭
 */
function loadingToast(msg) {
    layer.msg(msg, {
        time: false,
        icon: 16,
        shade: 0.8,
    })
    return false;
}


/**
 *   基于ydui-错误提示框
 */
function errorMsg(msg) {
    YDUI.dialog.toast(msg, 'error');
    return false;
}

/**
 *   基于ydui-成功提示框
 */
function successMsg(msg) {
    YDUI.dialog.toast(msg, 'success');
    return false;
}

/**
 *   基于ydui-成功并延迟2s跳转页面
 */
function successSetTimeOut(msg, url) {
    YDUI.dialog.toast(msg, 'success', 2000, function () {
        window.location.href = url;
    });
}

/**
 *   基于ydui-成功并延迟1s跳转页面
 */
function success1SetTimeOut(msg, url) {
    YDUI.dialog.toast(msg, 'success', 1000, function () {
        window.location.href = url;
    });
}

/**
 *   基于ydui-成功并延迟3s跳转页面
 */
function success3SetTimeOut(msg, url) {
    YDUI.dialog.toast(msg, 'success', 3000, function () {
        window.location.href = url;
    });
}

/**
 *   基于ydui-失败并延迟2s跳转页面
 */
function errorSetTimeOut(msg, url) {
    YDUI.dialog.toast(msg, 'error', 2000, function () {
        window.location.href = url;
    });
}

/**
 *  loading-延迟2s跳转
 * */
function loadSetTimeOut(msg, url) {
    showLoaders(msg);
    setTimeout(function () {
        hideLoaders()
        window.location.href = url;
    }, 1000);
}

/**
 *  给出提醒，然后跳转上一页
 * */
function loadbackUrlTimeOut(msg) {
    showLoaders(msg);
    setTimeout(function () {
        hideLoaders();
        var url = document.referrer;
        if (url == null) {
            window.location.href = "/";
            return false;
        }
        else {
            window.history.go(-1);
        }
    }, 2000);
}

/**
 *  显示加载中
 */
function showLoaders(msg) {
    var msgInfo = msg == null || msg == undefined || msg == "" ? "正在加载" : msg;
    YDUI.dialog.loading.open(msgInfo);
}

/**
 *  移除加载中
 */
function hideLoaders() {
    YDUI.dialog.loading.close();
}

/**
 *  输出一个没有图标的提示层
 * */
function showToastTips(msg) {
    YDUI.dialog.toast(msg, "")
}

/**
 *  支付成功,3S回调
 * @param {any} url
 */
function paymentIngToast(url) {
    showLoaders("支付成功,正在回调")
    setTimeout(function () {
        hideLoaders()
        window.location.href = url;
    }, 3000);
}