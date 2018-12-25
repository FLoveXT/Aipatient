var medicine = {
    recordId: "",
    Info: {

    },
    isDaiJian: false,
    haveDaiJian: false,
    friedStatus: false,
    tickets: {
        id: '',
        name: '',//使用的优惠券名称
        num: 0,//可用个数
        requestId: ''
    },
    resetURL: '',
    sourceMoney:0
};

$(function () {
    Init();
})

function Init() {
    var recordId = getQueryString("orderId");
    if (recordId == null || recordId == undefined || recordId == "") {
        errorSetTimeOut("记录ID为空", "/");
        return false;
    }
    medicine.recordId = recordId;
    getDetail();
}

function getDetail() {
    var api = '/api/order/my/to_create_order/' + medicine.recordId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                if (res.data == null) {
                    $("body").html("");
                    errorMsg("暂无可开方的处方单")
                    return false;
                }
                else {
                    medicine.Info = res.data;
                    $(".deatail-tit").html(template("user-div", { list: medicine.Info }));
                    $(".item-list").html(template("item-div", { list: medicine.Info }));

                    if (res.data.drugs != null) {
                        for (var i in res.data.drugs) {
                            if (res.data.drugs[i].hasOwnProperty("isFried")) {
                                medicine.haveDaiJian = true;
                                continue;
                            }
                        }
                    }
                    medicine.sourceMoney = res.data.totalFee;
                    $(".dj-list").html(template("dj-div", { list: medicine }));
                    $(".fee-list").html(template("fee-div", { list: medicine.Info }));
                    $(".addr-list").html(template("addr-div", { list: medicine.Info }));
                    $(".payment-item").html(template("payment-div", { list: medicine.Info }));
                    getTicketInfo();
                }
                console.log(res.data);
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}



/**
        *   ActionSheet-是否选择
        * */
function actionsheetOpen() {
    var $as = $('.m-actionsheet');
    $(".yn-api").click(function () {
        $as.actionSheet('open');
    });
}

/**
 *   获取是否点击获取
 * */
function actionSheetClick(_sex) {
    $(".is-daijian").text(_sex == "Y" ? "是" : _sex == "N" ? "否" : "");
    $(".is-daijian").attr("data-value", _sex);
    medicine.friedStatus = _sex == "Y" ? true : _sex == "N" ? false : false;
    var $as = $('.m-actionsheet');
    $as.actionSheet('close');
}

/**
 *   ActionSheet-是否关闭
 * */
function actionsheetClose() {
    var $as = $('.m-actionsheet');
    $as.actionSheet('close');
}

function addressInfo() {
    var url = '/pages/users/addr.html?actions=add&types=medicine';
    layer.open({
        type: 2,
        title: "获取收货地址",
        closeBtn: 0, //不显示关闭按钮
        shade: [0],
        area: ['100%', '100%'],
        anim: 2,
        btn: ['确定', '关闭'],
        content: url, //iframe的url，no代表不显示滚动条
        yes: function (layero, index) {
            console.log("点击了确定");
            var newpsw = window[index.find('iframe')[0]['name']];
            var value = newpsw.divActiveArray;
            if (value.isSelected == false) {
                newpsw.errorMsg("请选择一个地址,或点击取消");
                return false;
            }
            var detail = medicine.Info;
            detail.address = value.address;
            detail.addressId = value.id;
            detail.consignee = value.name;
            detail.consigneeTel = value.phone;
            $(".addr-list").html(template("addr-div", { list: detail }));
            layer.closeAll();
        }
    });
}

/**
 *  点击更多优惠券按钮使用Iframe
 * */
function tocketChange() {
    var url = '/pages/diagnose/ticket.html?actions=add&types=dr_prescription&fee=' + medicine.sourceMoney + "&id=" + medicine.tickets.id + "&businessId=" + medicine.recordId + "&sourceMoney=" + medicine.sourceMoney;
    layer.open({
        type: 2,
        title: "使用优惠券",
        closeBtn: 0, //不显示关闭按钮
        shade: [0],
        area: ['100%', '100%'],
        anim: 2,
        btn: ['确定', '关闭'],
        content: url, //iframe的url，no代表不显示滚动条
        yes: function (layero, index) {
            var newpsw = window[index.find('iframe')[0]['name']];
            var value = newpsw.ticketArray;
            if (value.isSelected == false) {
                newpsw.errorMsg("请选择一个优惠券,或点击取消");
                return false;
            }
            if (value.isNoBuy == true) {
                medicine.Info.totalFee = medicine.sourceMoney;
                medicine.tickets.requestId = "";
                medicine.tickets.id = "";
                medicine.tickets.name = "";
                $(".payment-item").html(template("payment-div", { list: medicine.Info }));
                $(".tickets-list").html(template("ticket-div", { item: medicine.tickets }));
                layer.closeAll();
                return;
            }
            resetMoney(value);
            console.log("value:");
            console.log(value);
        }
    });
}


function resetMoney(_value) {
    if (_value.payId == medicine.tickets.requestId) {
        layer.closeAll();
        return false;
    }
    var api = '/api/pay_order/get_fact_fee.json';
    var parments = {
        "couponId": _value.payId,
        "fee": medicine.Info.totalFee,
      
    };
    new postRequest({
        url: api,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                medicine.Info.totalFee = res.data.factFee;
                medicine.tickets.requestId = _value.payId;
                medicine.tickets.id = _value.payId;
                medicine.tickets.name = _value.name;
                $(".payment-item").html(template("payment-div", { list: medicine.Info }));
                $(".tickets-list").html(template("ticket-div", { item: medicine.tickets }));
             
                layer.closeAll();
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  初始化获取优惠券可用条数
 * */
function getTicketInfo() {
    var parments = {
        "businessType": "dr_prescription",
        "fee": medicine.Info.totalFee,
        "businessId": medicine.recordId
    };
    var url = "/api/coupon/available_quantity.json";
    new getRequest({
        url: url,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                var tickets = medicine.tickets;
                tickets.num = data;
                $(".tickets-list").html(template("ticket-div", { item: medicine.tickets }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  点击支付 
 *  1. 创建订单,订单完成开始支付
 *  获取支付参数
 * */
function weixinPay() {
    var parments = {};
    if (isWeiXin()) {
        parments = {
            "payType": "weixinpay_jsapi",
            "couponId": medicine.tickets.id,
            "orderId": medicine.recordId,
            "fromType": "weixin",
            "addressId": medicine.Info.addressId,
            "friedStatus": medicine.friedStatus
        };
    }
    else {
        parments = {
            "payType": "weixinpay_h5",
            "couponId": medicine.tickets.id,
            "orderId": medicine.recordId,
            "fromType": "H5",
            "addressId": medicine.Info.addressId,
            "friedStatus": medicine.friedStatus
        };
    }
    var api = '/api/order/my/pay_drug.json';
    var json = JSON.stringify(parments);
    new postJsonRequest({
        url: api,
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                getPaymentInfo(res.data);
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  开始支付
 * */
function getPaymentInfo(_this) {
    if (!isWeiXin()) {
        try {
            var appId = _this.appId;
            var mwebUrl = _this.mwebUrl;
            var recordId = _this.recordId;
            var prepayid = _this.prepayid;
            var push = [];
            push.push(Math.floor(Math.random() * 900) + 100)
            var json = JSON.stringify(push);
            console.log(json);
            var url = "&redirect_url=" + encodeURI(weixinUrl + "pages/diagnose/Payment/medicine-payment.html?parments=" + [recordId, Math.floor(Math.random() * 900) + 100]);
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
                        push.push(Math.floor(Math.random() * 900) + 100)
                        var json = JSON.stringify(push);
                        console.log(json);
                        var url = encodeURI(weixinUrl + "pages/diagnose/Payment/medicine-payment.html?parments=" + [recordId, Math.floor(Math.random() * 900) + 100]);
                        success1SetTimeOut("", url);
                       // checkApi(recordId);
                        return false;
                    } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
                        // showToastTips("支付取消");
                        errorSetTimeOut("支付取消", "/pages/users/order.html");
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
    var api = "/api/pay_order/check_pay.json";
    var parments = {
        businessId: businessId,
        businessType: "dr_prescription"
    };
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parments,
        callBack(res) { }
    })
    var url = '/pages/users/order.html';
    success3SetTimeOut("", url);
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
                checkApi(_recordId);
            }
        },
        {
            txt: '支付遇到问题',
            color: false,
            callback: function () {
                checkApi(_recordId);
            }
        }
    ]);
}