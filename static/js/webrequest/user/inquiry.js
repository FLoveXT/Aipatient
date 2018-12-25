//在线问诊.js
$(function () {
    Init();

    $(".tabs .tab").click(function () {
        var value = $(this).attr("data-value");
        if (value == "new") {
            $(this).addClass("active").siblings().removeClass("active");
            inquiry.new.pageIndex = 1;
            inquiry.new.list = [];
            inquiry.type = "new";
            getNewList();
            $(".item-list").hide().eq(0).show()
        } else {
            $(this).addClass("active").siblings().removeClass("active");
            inquiry.record.pageIndex = 1;
            inquiry.record.list = [];
            inquiry.type = "record";
            getRecordList();
            $(".item-list").hide().eq(1).show()
        }
    });
    $(window).scroll(function () {
        if ($(document).scrollTop() + $(window).height() >= $(document).height() - 50) {
            var type = inquiry.type;
            switch (type) {
                case "new":
                    if (!inquiry.new.disabled) {
                        return false;
                    }
                    inquiry.new.pageIndex = inquiry.new.pageIndex + 1;
                    getNewList();
                    console.log("new:" + inquiry.new.pageIndex);
                    break;
                case "record":
                    if (!inquiry.record.disabled) {
                        return false;
                    }
                    inquiry.record.pageIndex = inquiry.record.pageIndex + 1;
                    getRecordList();
                    console.log("record:" + inquiry.record.pageIndex);
                    break;
            }
        }
    });

    $(".icon02").addClass("icon02-on");
})
var inquiry = {
    new: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        list: []
    },
    record: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        list: []
    },
    type: "new",
    resetURL: ''
};

function InitIng() {
    var query = getQueryString("message");
    if (query == "104") {
        inquiry.record = {
            pageIndex: 1,
            pageSize: 10,
            disabled: false,
            list: []
        };
        $(".item-list").hide().eq(1).show()
        $(".tabs .tab[data-value='new']").removeClass("active");
        $(".tabs .tab[data-value='record']").addClass("active");
        getRecordList();
    } else {
        inquiry.new = {
            pageIndex: 1,
            pageSize: 10,
            disabled: false,
            list: []
        }
        getNewList();
        $(".item-list").hide().eq(0).show()
    }
}

/**
 *  初始化
 * */
function Init() {
    InitIng();
}

/**
 *  获取最新数据
 * */
function getNewList() {
    var parmets = {
        pageNum: inquiry.new.pageIndex,
        pageSize: inquiry.new.pageSize
    };
    new getRequest({
        url: "/api/order/inquiry/list_new.json",
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                inquiry.new.list = inquiry.new.list.concat(res.data);
                inquiry.new.disabled = res.page.pageCount > inquiry.new.pageIndex ? true : false; $(".new-list").html(template('new-div', { list: inquiry.new.list }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  获取记录
 * */
function getRecordList() {
    var parmets = {
        pageNum: inquiry.record.pageIndex,
        pageSize: inquiry.record.pageSize
    };
    new getRequest({
        url: "/api/order/inquiry/list_end.json",
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                inquiry.record.list = inquiry.record.list.concat(res.data);
                inquiry.record.disabled = res.page.pageCount > inquiry.record.pageIndex ? true : false; $(".record-list").html(template('record-div', { list: inquiry.record.list }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function goWriteInfo(_this) {
    var doctorId = $(_this).attr("data-doctorid");
    var recordId = $(_this).attr("data-recordid");
    var url = "/pages/diagnose/part01.html?recordId=" + recordId + "&doctorId=" + doctorId;
    loadSetTimeOut("请稍后", url);
    return false;
}

function gosuccess(_this) {
    var doctorId = $(_this).attr("data-doctorid");
    var recordId = $(_this).attr("data-recordid");
    var url = "/pages/diagnose/ai_detail.html?recordId=" + recordId;
    loadSetTimeOut("请稍后", url);
    return false;
}

function goPay(_this, _recordId,_doctorId) {
    YDUI.dialog.confirm('支付问诊提醒', '您确定要支付此订单吗?', function () {
        var parments = {
            "businessId": _recordId,
            "businessType": "dr_inquiry",
            "clientType": isWeiXin() ? "WEIXIN" : "H5"
        };
        var api = '/api/pay_order/to_pay.json';
        new postRequest({
            url: api,
            isShowLoader: true,
            param: parments,
            callBack(res) {
                if (res.code == 200) {
                    getPaymentInfo(res.data, _recordId, _doctorId);
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
 *  开始支付
 * */
function getPaymentInfo(_this, _recordId, _doctorId) {
    if (!isWeiXin()) {
        try {
            var appId = _this.appId;
            var mwebUrl = _this.mwebUrl;
            var prepayid = _this.prepayid;
            var push = [];
            push.push(_recordId);
            push.push(Math.floor(Math.random() * 900) + 100);
            push.push(_doctorId);
            var json = JSON.stringify(push);
            console.log(json);
            var url = "&redirect_url=" + encodeURI(weixinUrl + "pages/diagnose/Payment/online-payment.html?parments=" + [_recordId, Math.floor(Math.random() * 900) + 100, _doctorId]);
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
                        var push = [];
                        push.push(_recordId);
                        push.push(Math.floor(Math.random() * 900) + 100)
                        push.push(_doctorId);
                        var json = JSON.stringify(push);
                        console.log(json);
                        var url = encodeURI(weixinUrl + "pages/diagnose/Payment/online-payment.html?parments=" + [_recordId, Math.floor(Math.random() * 900) + 100, _doctorId]);
                        success1SetTimeOut("", url);
                        //checkApi(recordId);
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
        var parments = {
            businessId: businessId,
            businessType: "dr_inquiry"
        };
        var api = "/api/pay_order/check_pay.json";
        new getRequest({
            url: api,
            isShowLoader: true,
            param: parments,
            callBack(res) {
                if (res.code == 200) {
                    if (res.data.status == 1) {
                        success3SetTimeOut("支付成功", "/pages/users/inquiry.html");
                    } else {
                        errorSetTimeOut("支付失败", "/pages/users/inquiry.html");
                    }
                } else {
                    errorMsg(res, message);
                    return false;
                }
            }
        })
    }, 2000);
}




function goPayCancel(_this, recordId) {
    YDUI.dialog.confirm('取消问诊提醒', '您确定要取消此订单吗?', function () {
        var api = '/api/order/inquiry/cancel_pay/' + recordId + '.json';
        new putJsonRequest({
            url: api,
            isShowLoader: true,
            callBack(res) {
                if (res.code == 200) {
                    successSetTimeOut("取消成功", "/pages/users/inquiry.html");
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

function gorecordstatus(_this) {
    var recordId = $(_this).attr("data-recordid");
    var url = "/pages/diagnose/ai_detail.html?recordId=" + recordId;
    loadSetTimeOut("请稍后", url);
    return false;
}
function gorecordcancel(_this) {
    var doctorId = $(_this).attr("data-doctorid");
    var url = "/pages/home/doc_page.html?doctorId=" + doctorId;
    loadSetTimeOut("请稍后", url);
    return false;
}

/**
 *  询问订单是否支付成功
 * */
function ConfirmPaySuccess(_recordId) {
    console.log("初始化ID:" + _recordId);
    YDUI.dialog.confirm('请确认微信支付是否完成', '', [
        {
            txt: '已支付完成',
            color: "red",
            callback: function () {
                console.log("点击了已完成:ID:" + _recordId);
                checkApi(_recordId);
            }
        },
        {
            txt: '支付遇到问题',
            color: false,
            callback: function () {
                console.log("点击了取消:ID:" + _recordId);
                checkApi(_recordId);
            }
        }
    ]);
}