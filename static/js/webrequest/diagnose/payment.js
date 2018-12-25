//购买在线问诊.js
var paymentInfo = {
    doctorId: '',
    doctorInfo: {
        image: '',
        name: '',
        medicalInstitutions: '',
        titles: '',
        depart: '',
        diseaseExpertise: ''
    },
    settings: {
        time: '',
        num: 0,
        fee: 0.00,
        settingId: ''
    }, //选择日期回传数据
    tickets: {
        id: '',
        name: '',//使用的优惠券名称
        num: 0,//可用个数
        requestId: ''
    },
    resetUrl: '',//重新支付H5
    sourceMoney: 0
};
/**
 *  初始化
 * */
function Init() {
    var doctorId = getQueryString("doctorId");
    if (doctorId == null || doctorId == undefined || doctorId == "") {
        window.location.href = "/index.html";
        return false;
    }
    paymentInfo.doctorId = doctorId;
    getDoctorInfo();//获取医生信息
}

/**
 *  获取医生详情
 * */
function getDoctorInfo() {
    var doctorId = paymentInfo.doctorId;
    var url = "/api/doctor/payment_page/" + doctorId;
    new getRequest({
        url: url,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                let image = data.image;
                let name = data.name;
                let medicalInstitutions = data.medicalInstitutions;
                let titles = data.titles;
                let depart = data.depart;
                let diseaseExpertise = data.diseaseExpertise;
                paymentInfo.doctorInfo.depart = depart;
                paymentInfo.doctorInfo.diseaseExpertise = diseaseExpertise;
                paymentInfo.doctorInfo.image = image;
                paymentInfo.doctorInfo.medicalInstitutions = medicalInstitutions;
                paymentInfo.doctorInfo.name = name;
                paymentInfo.doctorInfo.titles = titles;
                $(".doctorinfo").html(template('doctorinfo-div', { item: paymentInfo.doctorInfo }));
                InitSettings();
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  获取初始化该医生的就诊信息
 * */
function InitSettings() {
    var doctorId = paymentInfo.doctorId;
    var parments = {
        doctorId: doctorId
    };
    var url = "/api/inquiry/lately_settings.json";
    new getRequest({
        url: url,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                var settings = paymentInfo.settings;
                settings["num"] = data.quota;
                settings["fee"] = data.fee;
                settings["settingId"] = data.settingId;
                settings["time"] = data.pageTime;
                paymentInfo.sourceMoney = data.fee;
                $(".value-assigment-settings").html(template("settings-div", { item: settings }));
                $(".payment-item").html(template("payment-div", { item: settings }));
                getTicketInfo();
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
        "businessType": "dr_inquiry",
        "fee": paymentInfo.settings.fee
    };
    var url = "/api/coupon/available_quantity.json";
    new getRequest({
        url: url,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                var tickets = paymentInfo.tickets;
                tickets.num = data;
                $(".tickets-list").html(template("ticket-div", { item: tickets }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  选择日期事件
 * */
function clickInvoke() {
    var url = "/pages/diagnose/questionlist.html?doctorId=" + paymentInfo.doctorId + "&randow=" + Math.floor(Math.random() * 900);
    layer.open({
        type: 2,
        title: "选择医生在线问诊时间",
        closeBtn: 0, //不显示关闭按钮
        shade: [0],
        area: ['100%', '100%'],
        anim: 2,
      //  btn: ['确定', '关闭'],
        content: [url], //iframe的url，no代表不显示滚动条
        //yes: function (layero, index) {
        //    var newpsw = window[index.find('iframe')[0]['name']];
        //    var value = newpsw.valueInfo;
        //    if (value.isSelected == false) {
        //        newpsw.errorMsg("请选择一个预约,或点击取消");
        //        return false;
        //    }
        //    paymentInfo.settings.time = value.time;
        //    paymentInfo.settings.num = value.num;
        //    paymentInfo.settings.fee = value.fee;
        //    paymentInfo.settings.settingId = value.id;
        //    paymentInfo.tickets.requestId = "";
        //    paymentInfo.tickets.id = "";
        //    paymentInfo.tickets.name = "";
        //    paymentInfo.sourceMoney = value.fee;
        //    valueAssignment();
        //    layer.closeAll();
        //}
    });
}

function valueAssignment() {
    $(".payment-item").html(template("payment-div", { item: paymentInfo.settings }));
    $(".value-assigment-settings").html(template("settings-div", { item: paymentInfo.settings }));
    $(".tickets-list").html(template("ticket-div", { item: paymentInfo.tickets }));
}

/**
 *  点击更多优惠券按钮使用Iframe
 * */
function tocketChange() {
    var url = '/pages/diagnose/ticket.html?actions=add&types=dr_inquiry&fee=' + paymentInfo.sourceMoney + "&id=" + paymentInfo.tickets.id + "&sourceMoney=" + paymentInfo.sourceMoney;
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
                paymentInfo.settings.fee = paymentInfo.sourceMoney;
                paymentInfo.tickets.requestId = "";
                paymentInfo.tickets.id = "";
                $(".payment-item").html(template("payment-div", { item: paymentInfo.settings }));
                $(".tickets-list").html(template("ticket-div", { item: tickets }));
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
    if (_value.payId == paymentInfo.tickets.requestId) {
        layer.closeAll();
        return false;
    }
    var api = '/api/pay_order/get_fact_fee.json';
    var parments = {
        "couponId": _value.payId,
        "fee": paymentInfo.sourceMoney
    };
    new postRequest({
        url: api,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                paymentInfo.settings.fee = res.data.factFee;
                paymentInfo.tickets.requestId = _value.payId;
                paymentInfo.tickets.id = _value.payId;
                paymentInfo.tickets.name = _value.name;
                $(".payment-item").html(template("payment-div", { item: paymentInfo.settings }));
                $(".tickets-list").html(template("ticket-div", { item: paymentInfo.tickets }));
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
 *  点击支付 
 *  1. 创建订单,订单完成开始支付
 *  获取支付参数
 * */
function weixinPay() {
    var parments = {};
    if (isWeiXin()) {
        parments = {
            "payType": "weixinpay_jsapi",
            "couponId": paymentInfo.tickets.id,
            "settingsId": paymentInfo.settings.settingId,
            "fromType": "weixin",
            "doctorId": paymentInfo.doctorId
        };
    }
    else {
        parments = {
            "payType": "weixinpay_h5",
            "couponId": paymentInfo.tickets.id,
            "settingsId": paymentInfo.settings.settingId,
            "fromType": "H5",
            "doctorId": paymentInfo.doctorId
        };
    }
    var api = '/api/order/inquiry/save_apply.json';
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
            push.push(recordId);
            push.push(Math.floor(Math.random() * 900) + 100);
            push.push(paymentInfo.doctorId)
            var json = JSON.stringify(push);
            console.log(json);
            var url = "&redirect_url=" + encodeURI(weixinUrl + "pages/diagnose/Payment/online-payment.html?parments=" + [recordId, Math.floor(Math.random() * 900) + 100, paymentInfo.doctorId]);
            
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
                        push.push(recordId);
                        push.push(Math.floor(Math.random() * 900) + 100);
                        push.push(paymentInfo.doctorId)
                        var json = JSON.stringify(push);
                        console.log(json);
                        var url = encodeURI(weixinUrl + "pages/diagnose/Payment/online-payment.html?parments=" + [recordId, Math.floor(Math.random() * 900) + 100, paymentInfo.doctorId]);
                        success1SetTimeOut("", url);
                     //   checkApi(recordId);
                        return false;
                    } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
                        //  showToastTips("支付取消");
                        errorSetTimeOut("支付取消", "/pages/users/inquiry.html");
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
            businessType: "dr_inquiry"
        };
        new getRequest({
            url: api,
            isShowLoader: true,
            param: parments,
            callBack(res) {
                if (res.code == 200) {
                    if (res.data.status == 1) { 
                        var doctorId = paymentInfo.doctorId;
                        var url = '/pages/diagnose/part01.html?doctorId=' + doctorId + "&recordId=" + businessId + "&islast=0";
                        success3SetTimeOut("支付成功", url);
                    } else {
                        errorSetTimeOut("订单未支付", "/pages/users/inquiry.html");
                    }
                } else {
                    errorMsg(res, message);
                    return false;
                }
            }
        })
        
    }, 3000);
}

Init();



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