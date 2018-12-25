
var order_detail = {
    name: '',
    age: '',
    sex: '',
    phoneNumber: "",
    applyTime: '',
    limitTime: '',
    diseaseDescribe: '',
    adviceDiacrisis: '',
    diagnosisFee: '',
    drugFee: '',
    makeFee: '',
    expressFee: '',
    consignee: '',
    consigneeTel: '',
    address: '',
    drugs: [],
    isPay: false,
    isCancel: false,
    orderId: '',
    medicalHistory: '',
    remarks: '',
    paydetailList: [],
    isFried: '不代煎',
    logistics: false, //是否显示物流信息
    logisticsList: [],
    isAppraise: false,
    isHaveFried: false,
    haveDaiJian: false
}
$(function () {
    $(".footer-info").remove();
    $("body").addClass("active");
    Init();
})
function Init() {
    
    var status = getQueryString("status");
    var orderId = getQueryString("orderId");
    order_detail.orderId = orderId;
    switch (status) {
        case "01":
            waitPayDetail();
            break;
        case "02":
            waitCollectDetail();
            break;
        case "03":
            completeDetail();
            break;
    }
}

/**
 *  待支付详情
 * */
function waitPayDetail() {
    var api = "/api/order/my/to_pay_order/" + order_detail.orderId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                order_detail.name = data.name;
                order_detail.age = data.age;
                order_detail.sex = data.sex;
                order_detail.phoneNumber = data.phoneNumber;
                order_detail.applyTime = data.applyTime;
                order_detail.limitTime = data.limitTime;
                order_detail.diseaseDescribe = data.diseaseDescribe;
                order_detail.adviceDiacrisis = data.adviceDiacrisis;
                order_detail.diagnosisFee = data.diagnosisFee;
                order_detail.drugFee = data.drugFee;
                order_detail.makeFee = data.makeFee;
                order_detail.expressFee = data.expressFee;
                order_detail.consignee = data.consignee;
                order_detail.consigneeTel = data.consigneeTel;
                order_detail.address = data.address;
                order_detail.drugs = data.drugs;
                order_detail.orderId = data.orderId;
                order_detail.medicalHistory = data.medicalHistory;
                order_detail.remarks = data.remarks;
                order_detail.isPay = data.isPay;
                order_detail.isCancel = data.isCancel;
                //if (data.hasOwnProperty("isFried")) {
                //    order_detail.isFried = data.isFried;
                //    order_detail.isHaveFried = data.isFried;
                //}
                if (res.data.drugs != null) {
                    for (var i in res.data.drugs) {
                        if (res.data.drugs[i].hasOwnProperty("isFried")) {
                            order_detail.haveDaiJian = true;
                            order_detail.isFried = res.data.drugs[i].isFried;
                            order_detail.isHaveFried = res.data.drugs[i].isFried;
                            continue;
                        }
                    }
                }
                console.log(order_detail);
                $(".detail-info").html(template("detail-div", { item: order_detail }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  待收货详情
 * */
function waitCollectDetail() {
    var api = "/api/order/my/to_collect_goods/" + order_detail.orderId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                order_detail.name = data.name;
                order_detail.age = data.age;
                order_detail.sex = data.sex;
                order_detail.phoneNumber = data.phoneNumber;
                order_detail.applyTime = data.applyTime;
                order_detail.limitTime = data.limitTime;
                order_detail.diseaseDescribe = data.diseaseDescribe;
                order_detail.adviceDiacrisis = data.adviceDiacrisis;
                order_detail.diagnosisFee = data.diagnosisFee;
                order_detail.drugFee = data.drugFee;
                order_detail.makeFee = data.makeFee;
                order_detail.expressFee = data.expressFee;
                order_detail.consignee = data.consignee;
                order_detail.consigneeTel = data.consigneeTel;
                order_detail.address = data.address;
                order_detail.drugs = data.drugs;
                order_detail.orderId = data.orderId;
                order_detail.medicalHistory = data.medicalHistory;
                order_detail.remarks = data.remarks;
                order_detail.logistics = true;
                order_detail.logisticsList = data.logistics
                if (res.data.drugs != null) {
                    for (var i in res.data.drugs) {
                        if (res.data.drugs[i].hasOwnProperty("isFried")) {
                            order_detail.haveDaiJian = true;
                            order_detail.isFried = res.data.drugs[i].isFried;
                            order_detail.isHaveFried = res.data.drugs[i].isFried;
                            continue;
                        }
                    }
                }
                console.log(order_detail);
                $(".detail-info").html(template("detail-div", { item: order_detail }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  已完成详情
 * */
function completeDetail() {
    var api = "/api/order/my/drug_detail/" + order_detail.orderId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                order_detail.name = data.name;
                order_detail.age = data.age;
                order_detail.sex = data.sex;
                order_detail.phoneNumber = data.phoneNumber;
                order_detail.applyTime = data.applyTime;
                order_detail.limitTime = data.limitTime;
                order_detail.diseaseDescribe = data.diseaseDescribe;
                order_detail.adviceDiacrisis = data.adviceDiacrisis;
                order_detail.diagnosisFee = data.diagnosisFee;
                order_detail.drugFee = data.drugFee;
                order_detail.makeFee = data.makeFee;
                order_detail.expressFee = data.expressFee;
                order_detail.consignee = data.consignee;
                order_detail.consigneeTel = data.consigneeTel;
                order_detail.address = data.address;
                order_detail.drugs = data.drugs;
                order_detail.orderId = data.orderId;
                order_detail.medicalHistory = data.medicalHistory;
                order_detail.remarks = data.remarks;
                order_detail.logistics = true;
                order_detail.logisticsList = data.logistics;
                order_detail.isAppraise = data.isAppraise
                if (res.data.drugs != null) {
                    for (var i in res.data.drugs) {
                        if (res.data.drugs[i].hasOwnProperty("isFried")) {
                            order_detail.haveDaiJian = true;
                            order_detail.isFried = res.data.drugs[i].isFried;
                            order_detail.isHaveFried = res.data.drugs[i].isFried;
                            continue;
                        }
                    }
                }
                console.log(order_detail);
                $(".detail-info").html(template("detail-div", { item: order_detail }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}






function goPay() {

    YDUI.dialog.confirm('支付问诊提醒', '您确定要支付此订单吗?', function () {
        var parments = {
            "businessId": order_detail.orderId,
            "businessType": "dr_prescription",
            "clientType": isWeiXin()?"WEIXIN":"H5"
        };
        var api = '/api/pay_order/to_pay.json';
        new postRequest({
            url: api,
            isShowLoader: true,
            param: parments,
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
    });
}

/**
 *  开始支付
 * */
function getPaymentInfo(_this) {
    if (!isWeiXin()) {
        try {
            var appId = _this.appId;
            var mwebUrl = _this.mwebUrl;
            var prepayid = _this.prepayid;
            var url = "&redirect_url=" + encodeURI(weixinUrl + "pages/diagnose/Payment/medicine-payment.html?parments=" + [order_detail.orderId, Math.floor(Math.random() * 900) + 100]);
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
                        var url = encodeURI(weixinUrl + "pages/diagnose/Payment/medicine-payment.html?parments=" + [order_detail.orderId, Math.floor(Math.random() * 900) + 100]);
                        success1SetTimeOut("", url);
                      //  checkApi(recordId);
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
    loadSetTimeOut("/pages/users/order.html");
}

function goPayCancel() {
    YDUI.dialog.confirm('取消订单提醒', '您确定取消该处方单?', function () {
        var api = '/api/order/my/cancel/' + order_detail.orderId + '';
        new putJsonRequest({
            url: api,
            isShowLoader: true,
            callBack(res) {
                if (res.code == 200) {
                    successSetTimeOut("取消成功", "/pages/users/order.html");
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
 *  评价医生
 * */
function goAppraise() {
    var url = "/pages/users/appraise_details.html?status=0&orderid=" + order_detail.orderId ;
    loadSetTimeOut("",url);
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