//我的处方单.js

var order = {
    orderType: 'all',
    all: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        List: []
    },
    waitPay: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        List: []
    },
    pendingReceipt: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        List: []
    },
    complete: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        List: []
    },
    cancel: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        List: []
    },

};

/**
 * 初始化加载
 * */
function Init() {
    var message = getQueryString("message");
    if (message == "wait") {
        order.waitPay.pageIndex = 1;
        getWaitPay();
        order.orderType = "wait_pay";
        order.waitPay.List = [];
        $(".order").hide().eq(1).show();
        $(".tabs .tab").eq(1).addClass("active").siblings().removeClass("active");
    }
    else if (message == "record") {
        //已支付
        order.pendingReceipt.pageIndex = 1;
        getWait_receipt();
        order.orderType = "wait_receipt";
        $(".order").hide().eq(2).show()
        order.pendingReceipt.List = [];
        $(".tabs .tab").eq(2).addClass("active").siblings().removeClass("active");
    }
    else {
        order.all.pageIndex = 1;
        order.cancel.pageIndex = 1;
        order.complete.pageIndex = 1;
        order.pendingReceipt.pageIndex = 1;
        order.waitPay.pageIndex = 1;
        getAll();
    } 
}

/**
 *  获取所有的数据
 * */
function getAll() {
    var api = "/api/order/my/list.json";
    var parment = {
        "pageNum": order.all.pageIndex,
        "pageSize": order.all.pageSize,
        "type": ''
    };
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parment,
        callBack(res) {
            if (res.code == 200) {
                var list = order.all.List.concat(res.data);
                var disabled = res.page.pageCount > order.all.pageIndex ? true : false

                order.all.List = list;
                order.all.disabled = disabled;
                $(".order").hide().eq(0).show()
                $(".list01").html(template('list01-div', { list: order.all.List }))
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  获取待收货
 * */
function getWait_receipt() {
    var api = "/api/order/my/list.json";
    var parment = {
        "pageNum": order.pendingReceipt.pageIndex,
        "pageSize": order.pendingReceipt.pageSize,
        "type": 'wait_receipt'
    };
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parment,
        callBack(res) {
            if (res.code == 200) {
                var list = order.pendingReceipt.List.concat(res.data);
                var disabled = res.page.pageCount > order.pendingReceipt.pageIndex ? true : false
                order.pendingReceipt.List = list;
                order.pendingReceipt.disabled = disabled;
                $(".list03").html(template('list03-div', { list: order.pendingReceipt.List }))
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  获取待支付
 * */
function getWaitPay() {
    var api = "/api/order/my/list.json";
    var parment = {
        "pageNum": order.waitPay.pageIndex,
        "pageSize": order.waitPay.pageSize,
        "type": 'wait_pay'
    };
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parment,
        callBack(res) {
            if (res.code == 200) {
                var list = order.waitPay.List.concat(res.data);
                var disabled = res.page.pageCount > order.waitPay.pageIndex ? true : false
                order.waitPay.List = list;
                order.waitPay.disabled = disabled;
                $(".list02").html(template('list02-div', { list: order.waitPay.List }))
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}


/**
 *  获取已完成
 * */
function getComplete() {
    var api = "/api/order/my/list.json";
    var parment = {
        "pageNum": order.complete.pageIndex,
        "pageSize": order.complete.pageSize,
        "type": 'complete'
    };
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parment,
        callBack(res) {
            if (res.code == 200) {
                var list = order.complete.List.concat(res.data);
                var disabled = res.page.pageCount > order.complete.pageIndex ? true : false
                order.complete.List = list;
                order.complete.disabled = disabled;
                $(".list04").html(template('list04-div', { list: order.complete.List }))
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  获取已取消
 * */
function getCancel() {
    var api = "/api/order/my/list.json";
    var parment = {
        "pageNum": order.cancel.pageIndex,
        "pageSize": order.cancel.pageSize,
        "type": 'cancel'
    };
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parment,
        callBack(res) {
            if (res.code == 200) {
                var list = order.cancel.List.concat(res.data);
                var disabled = res.page.pageCount > order.cancel.pageIndex ? true : false
                order.cancel.List = list;
                order.cancel.disabled = disabled;
                $(".list05").html(template('list05-div', { list: order.cancel.List }))
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

$(function () {

    Init();

    $(".tab-click .tab").click(function () {
        var value = $(this).attr("data-value");
        if (value == "return") {
            var url = "/pages/users/services.html";
            loadSetTimeOut("请稍等", url);
            return false;
        }
        switch (value) {
            case "all":
                $(this).addClass("active").siblings().removeClass("active");
                order.all.pageIndex = 1;
                order.all.List = [];
                order.orderType = "all";
                getAll();
                $(".order").hide().eq(0).show()
                break;
            case "wait_pay":
                $(this).addClass("active").siblings().removeClass("active");
                order.waitPay.pageIndex = 1;
                order.orderType = "wait_pay";
                order.waitPay.List = [];
                getWaitPay();
                $(".order").hide().eq(1).show()
                break;
            case "wait_receipt":
                $(this).addClass("active").siblings().removeClass("active");
                order.pendingReceipt.pageIndex = 1;
                getWait_receipt();
                order.orderType = "wait_receipt";
                $(".order").hide().eq(2).show()
                order.pendingReceipt.List = [];
                break;
            case "complete":
                $(this).addClass("active").siblings().removeClass("active");
                order.complete.pageIndex = 1;
                order.orderType = "complete";
                $(".order").hide().eq(3).show()
                order.complete.List = [];
                getComplete();
                break;
            case "cancel":
                $(this).addClass("active").siblings().removeClass("active");
                order.cancel.pageIndex = 1;
                order.orderType = "cancel";
                $(".order").hide().eq(4).show()
                order.cancel.List = [];
                getCancel();
                break;
        }
    });


    $(window).scroll(function () {
        if ($(document).scrollTop() + $(window).height() >= $(document).height() - 50) {
            var type = order.orderType;
            switch (type) {
                case "all":
                    if (!order.all.disabled) {
                        return false;
                    }
                    order.all.pageIndex = order.all.pageIndex + 1;
                    getAll();
                    console.log("all:" + order.all.pageIndex);
                    break;
                case "wait_pay":
                    if (!order.waitPay.disabled) {
                        return false;
                    }
                    order.waitPay.pageIndex = order.waitPay.pageIndex + 1;
                    getWaitPay();
                    console.log("wait_pay:" + order.waitPay.pageIndex);
                    break;
                case "wait_receipt":
                    if (!order.pendingReceipt.disabled) {
                        return false;
                    }
                    order.pendingReceipt.pageIndex = order.pendingReceipt.pageIndex + 1;
                    getWait_receipt();
                    console.log("wait_pay:" + order.pendingReceipt.pageIndex);
                    break;
                case "complete":
                    if (!order.complete.disabled) {
                        return false;
                    }
                    order.complete.pageIndex = order.complete.pageIndex + 1;
                    getComplete();
                    console.log("complete:" + order.complete.pageIndex);
                    break;
                case "cancel":
                    if (!order.cancel.disabled) {
                        return false;
                    }
                    order.cancel.pageIndex = order.cancel.pageIndex + 1;
                    getCancel();
                    console.log("cancel:" + order.cancel.pageIndex);
                    break;
            }
        }
    });

})

/**
 *  去支付链接跳转
 * @param {any} _orderId
 */
function goApiLink(_orderId) {
    var api = "/api/order/my/jump/" + _orderId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var jump = res.data.jump;
                var url = "";
                if (jump == 0) {//未下单 去购买页
                    url = "/pages/diagnose/medicine.html?orderId=" + _orderId
                }
                else if (jump == 1) {
                    url = "/pages/users/order_details.html?orderId=" + _orderId + "&status=0" + jump
                }
                else {
                    return false;
                }
                loadSetTimeOut("请稍等",url);
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
 *  取消该订单
 * @param {any} _orderId
 */
function goCancelPay(_orderId) {
    YDUI.dialog.confirm('取消订单提醒', '您确定要取消此订单吗?', function () {
        var api = "/api/order/my/cancel/" + _orderId;
        new getRequest({
            url: api,
            isShowLoader: true,
            callBack(res) {
                if (res.code == 200) {
                    loadSetTimeOut("", "/pages/users/order.html");
                    return false;
                }
                else {
                    errorMsg(res.message);
                    return false;
                }
            }
        })
    });
}

/**
 *  查看详情
 * @param {any} _orderId
 * @param {any} _status
 */
function getshowdetail(_orderId, _status) {
    var url = '/pages/users/order_details.html?orderId=' + _orderId + "&status=" + _status;
    loadSetTimeOut("请稍等", url);
    return false;
}