
//我的预约.js
var appoint = {
    new: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        List: []
    },
    record: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        List: []
    },
    type: 'new'
};

function Init() {
    var query = getQueryString("message");
    if (query == "202") {
        $(".item-list").hide().eq(1).show()
        $(".tabs .tab[data-value='new']").removeClass("active");
        $(".tabs .tab[data-value='record']").addClass("active");
        appoint.record.pageIndex = 1;
        recordAppoint();
    }
    else {
        appoint.new.pageIndex = 1;
        appoint.new.List = [];
        newAppoint();
    }
    
}

/**
 *  获取最新预约数据
 * */
function newAppoint() {
    var api = "/api/order/appointment/list_new.json";
    var parment = {
        "pageNum": appoint.new.pageIndex,
        "pageSize": appoint.new.pageSize,
    };
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parment,
        callBack(res) {
            if (res.code == 200) {
                var list = appoint.new.List.concat(res.data);
                var disabled = res.page.pageCount > appoint.new.pageIndex ? true : false
                appoint.new.List = list;
                appoint.new.disabled = disabled;
                $(".list01").html(template('list01-div', { list: appoint.new.List }))
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  获取预约记录数据
 * */
function recordAppoint() {
    var api = "/api/order/appointment/list_end.json";
    var parment = {
        "pageNum": appoint.record.pageIndex,
        "pageSize": appoint.record.pageSize,
    };
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parment,
        callBack(res) {
            if (res.code == 200) {
                var list = appoint.record.List.concat(res.data);
                var disabled = res.page.pageCount > appoint.record.pageIndex ? true : false
                appoint.record.List = list;
                appoint.record.disabled = disabled;
                $(".list02").html(template('list02-div', { list: appoint.record.List }))
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
    $(".tabs .tab").click(function () {
        var value = $(this).attr("data-value");
        switch (value) {
            case "new":
                $(this).addClass("active").siblings().removeClass("active");
                appoint.new.pageIndex = 1;
                appoint.new.List = [];
                appoint.type = "new";
                newAppoint();
                $(".list-item").hide().eq(0).show()
                break;
            case "record":
                $(this).addClass("active").siblings().removeClass("active");
                appoint.record.pageIndex = 1;
                appoint.record.List = [];
                appoint.type = "record";
                recordAppoint();
                $(".list-item").hide().eq(1).show()
                break;
            default:
                return false;
        }
    });


    $(window).scroll(function () {
        if ($(document).scrollTop() + $(window).height() >= $(document).height() - 50) {
            var type = appoint.type;
            switch (type) {
                case "new":
                    if (!appoint.new.disabled) {
                        return false;
                    }
                    appoint.new.pageIndex = appoint.new.pageIndex + 1;
                    newAppoint();
                    console.log("new:" + appoint.new.pageIndex);
                    break;
                case "record":
                    if (!appoint.record.disabled) {
                        return false;
                    }
                    appoint.record.pageIndex = appoint.record.pageIndex + 1;
                    recordAppoint();
                    console.log("wait_pay:" + appoint.record.pageIndex);
                    break;
            }
        }
    });

})

/**
 *   取消预约
 * */
function goCancelAppint(_this, name, time, businessId) {
    /* 先查询该订单是否扣钱 */
    var api = '/api/order/appointment/cancel_prompt/' + businessId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                var tipsMessage = "";
                if (data.isRefund) {
                    tipsMessage = "请确认是否取消此次预约?";
                } else {
                    tipsMessage = "您预约的" + name + "医生" + time + "面诊服务离开始已不足24小时，现在取消，已支付的费用将不退还，确认是否取消?";
                }
                YDUI.dialog.confirm('取消预约提醒', tipsMessage, function () {
                    var api2 = '/api/order/appointment/cancel_order/' + businessId + '.json';
                    new  putJsonRequest({
                        url: api2,
                        isShowLoader: true,
                        callBack(res2) {
                            if (res2.code == 200) {
                                //成功
                                //刷新本页面
                                loadSetTimeOut("", "/pages/users/appoint.html");
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
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}


/**
 *  取消支付
 * */
function goCancelPay(businessId) {
    YDUI.dialog.confirm('取消支付提醒', "确定取消支付该问诊吗?", function () {
        var api = '/api/order/appointment/cancel_pay/' + businessId + '.json';
        new putJsonRequest({
            url: api,
            isShowLoader: true,
            callBack(res2) {
                if (res2.code == 200) {
                    loadSetTimeOut("", "/pages/users/appoint.html");
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

function goPay(_recordId) {
    YDUI.dialog.confirm('支付问诊提醒', '您确定要支付此订单吗?', function () {
        var parments = {
            "businessId": _recordId,
            "businessType": "dr_appointment",
            "clientType": isWeiXin() ? "WEIXIN" : "H5"
        };
        var api = '/api/pay_order/to_pay.json';
        new postRequest({
            url: api,
            isShowLoader: true,
            param: parments,
            callBack(res) {
                if (res.code == 200) {
                    getPaymentInfo(res.data, _recordId);
                }
                else {
                    errorMsg(res.message);
                    return false;
                }
            }
        })
    });
}

function getPaymentInfo(_this, recordId) {
    if (!isWeiXin()) {
        try {
            var appId = _this.appId;
            var mwebUrl = _this.mwebUrl;
            //var recordId = _this.recordId;
            var prepayid = _this.prepayid;
            var push = [];
            push.push(recordId);
            push.push(Math.floor(Math.random() * 900) + 100)
            var json = JSON.stringify(push);
            console.log(json);
            var url = "&redirect_url=" + encodeURI(weixinUrl + "pages/diagnose/Payment/offnine-payment.html?parments=" + json);
            window.location.href = mwebUrl + url;
        }
        catch (error) {
            errorMsg(error);
            return false;
        }
    }
    else {
        try {
            var appId = _this.appId;
            var nonceStr = _this.nonceStr;
            var package = _this.package;
            var paySign = _this.paySign;
            var signType = _this.signType;
            var timeStamp = _this.timeStamp;
            var recordId = _this.recordId;
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": appId,     //公众号名称，由商户传入     
                    "timeStamp": timeStamp,         //时间戳，自1970年以来的秒数     
                    "nonceStr": nonceStr, //随机串     
                    "package": package,
                    "signType": signType,         //微信签名方式:     
                    "paySign": paySign, //微信签名 
                },
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        //   checkApi(recordId);
                        var push = [];
                        push.push(recordId);
                        push.push(Math.floor(Math.random() * 900) + 100)
                        var json = JSON.stringify(push);
                        var url = encodeURI(weixinUrl + "pages/diagnose/Payment/offnine-payment.html?parments=" + json);
                        success1SetTimeOut("", url);
                        return false;
                    } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
                        showToastTips("支付取消");
                        return false;
                    }
                    else {
                        errorMsg("支付过程中发生错误,res:" + res);
                        return false;
                    }
                }
            );
        }
        catch (error) {
            errorMsg(error);
            return false;
        }
    }
}


function checkApi(businessId) {
    showLoaders();
    setTimeout(function () {
        hideLoaders();
        var api = "/api/pay_order/check_pay.json";
        var parments = {
            businessId: businessId,
            businessType: "dr_appointment"
        };
        new getRequest({
            url: api,
            isShowLoader: true,
            param: parments,
            callBack(res) {
                if (res.code == 200) {
                    if (res.data.status == 1) {
                        var url = '/pages/users/appoint.html?isreturn=1';
                        success3SetTimeOut("线下面诊费用支付成功", url);
                    }
                    else {
                        var url = "/pages/users/appoint.html?isreturn=1";
                        errorSetTimeOut("线下面诊费用支付失败", url);
                    }
                } else {
                    errorMsg(res, message);
                    return false;
                }
            }
        })
    }, 3000);
}