var offline = {
    doctorId: "",
    users: {
        imgaes: '',
        titles: '',
        depart: '',
        medicalInstitutions: '',
        diseaseExpertise: []
    },
    lately: {
        latelypageTime: '',
        latelyId: '',
        latelyquota: 0, //可预约数
        latelyFee: 0, //预约钱
        latelyaddress: '', //预约地址
    },
    latelyOtherTimeList: [],//预约列表
    tickets: {
        id: '',
        name: '',//使用的优惠券名称
        num: 0,//可用个数
        requestId: ''
    },
    patientList: {
        List: [],
        Title: '',
        id: ''
    },
    resetURL: "",//H5支付
    recordId: '',
    sourceMoney: 0
};

$(function () {
    Init();

    $(".bg-01").click(function () {
        $(this).hide();
        $(".selectPop-01").hide();
        EabledScroll();
    });

    $(".bg-02").click(function () {
        $(this).hide();
        $(".selectPop-02").hide();
        EabledScroll();
    });
})

function Init() {
    var doctorId = getQueryString("doctorId");
    if (doctorId == null || doctorId == undefined || doctorId == "") {
        errorSetTimeOut("请求参数错误", "/");
        return false;
    }
    offline.doctorId = doctorId;
    getdoctorInfo();
}
/**
 * 获取医生信息
 * */
function getdoctorInfo() {
    var doctorId = offline.doctorId;
    var url = "/api/doctor/index/" + doctorId;
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
                offline.users.depart = depart;
                offline.users.diseaseExpertise = diseaseExpertise;
                offline.users.image = image;
                offline.users.medicalInstitutions = medicalInstitutions;
                offline.users.name = name;
                offline.users.titles = titles;
                $(".doctorinfo").html(template('doctor-div', { item: offline.users }));
                ChooseDateTime();//选择日期
                GetAllLatelyDataList();//获取全部列表
                GetParientsInfo();//获取患者列表
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  选择日期
 * */
function ChooseDateTime() {
    var api = '/api/appointment/lately_appointment.json';
    var parments = {
        doctorId: offline.doctorId
    }
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data[0];
                if (data == undefined || data == null) {
                    data = {
                        pageTime: "",
                        id: "",
                        quota: 0,
                        fee: 0,
                        address: ''
                    };
                }
                offline.lately.latelypageTime = data.pageTime;
                offline.lately.latelyId = data.id;
                offline.lately.latelyquota = data.quota;
                offline.lately.latelyFee = data.fee;
                offline.lately.latelyaddress = data.address;
                offline.sourceMoney = data.fee;
                $(".lately-info").html(template('lately-div', { item: offline.lately }));
                getAvailablenum();
                $(".payment-item").html(template("payment-div", { item: offline.lately }));
                console.log(data);
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  选择其他日期
 * */
function ChooseOtherDateTime() {
    $(".selectPop-01").show();
    $(".selectPop-01 .bg-01").show();
    DisabledScroll();
}

/**
 *  选择患者
 * */
function selectPatientShowInfo() {
    $(".selectPop-02").show();
    $(".selectPop-02 .bg-02").show();
    DisabledScroll();
}

/**
 *  获取预约全部数据
 * */
function GetAllLatelyDataList() {
    var api = '/api/appointment/list_appointment.json';
    var parments = {
        doctorId: offline.doctorId
    }
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                offline.latelyOtherTimeList = data;
                $(".lately-list").html(template('latelylist-div', { list: offline.latelyOtherTimeList }));
                console.log("data");
                console.log(data.length);
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function latelyChange(_this, _time, _quota, _address, _id, _fee) {
    offline.lately.latelyaddress = _address;
    offline.lately.latelyFee = _fee;
    offline.lately.latelyId = _id;
    offline.lately.latelypageTime = _time;
    offline.lately.latelyquota = _quota;
    offline.sourceMoney = _fee;
    $(".lately-info").html(template('lately-div', { item: offline.lately }));
    $(".bg-01").click();
}

/**
 *  获取优惠券可用数量
 * */
function getAvailablenum() {
    var api = '/api/coupon/available_quantity.json';
    var parments = {
        businessType: "dr_appointment",
        fee: offline.lately.latelyFee ? offline.lately.latelyFee : 0
    }
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                offline.tickets.num = data;
                $(".tickets-list").html(template("ticket-div", { item: offline.tickets }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  点击更多优惠券按钮使用Iframe
 * */
function tocketChange() {
    var url = '/pages/diagnose/ticket.html?actions=add&types=dr_appointment&fee=' + offline.sourceMoney + "&id=" + offline.tickets.id + "&v=" + Math.random() + "&sourceMoney=" + offline.sourceMoney;
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
                offline.lately.latelyFee = offline.sourceMoney;
                offline.tickets.requestId = "";
                offline.tickets.id = "";
                offline.tickets.name = "";
                $(".payment-item").html(template("payment-div", { item: offline.lately }));
                $(".tickets-list").html(template("ticket-div", { item: offline.tickets }));
                layer.closeAll();
                return;
            }
            resetMoney(value);
            console.log("value:");
            console.log(value);
            layer.closeAll();
        }
    });
}

function resetMoney(_value) {
    if (_value.payId == offline.tickets.requestId) {
        layer.closeAll();
        return false;
    }
    var api = '/api/pay_order/get_fact_fee.json';
    var parments = {
        "couponId": _value.payId,
        "fee": offline.sourceMoney
    };
    new postRequest({
        url: api,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {

                offline.lately.latelyFee = res.data.factFee;
                offline.tickets.requestId = _value.payId;
                offline.tickets.id = _value.payId;
                offline.tickets.name = _value.name

                $(".payment-item").html(template("payment-div", { item: offline.lately }));
                $(".tickets-list").html(template("ticket-div", { item: offline.tickets }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  获取患者列表
 * */
function GetParientsInfo() {
    var api = '/api/patient/list.json';
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                offline.patientList.List = data;
                $(".patientList-list").html(template("patientList-div", { list: offline.patientList.List }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  患者点击事件
 * */
function PatientSelect(_name, _sex, _age, _id) {
    var value = _name + " " + _sex + " " + _age;
    $(".xuanze-parient span").text(value);
    offline.patientList.Title = value;
    offline.patientList.id = _id;
    $(".bg-02").click();
}

function goadd() {
    var url = '/pages/diagnose/part02.html?actions=add&userId=&types=buy_line_services';
    layer.open({
        type: 2,
        title: false,
        closeBtn: 0, //不显示关闭按钮
        shade: [0],
        area: ['100%', '100%'],
        anim: 2,
        scrollbar: false,
        content: [url], //iframe的url，no代表不显示滚动条
    });
}




/**
 *  点击支付 
 *  1. 创建订单,订单完成开始支付
 *  获取支付参数
 * */
function weixinPay() {
    if (offline.doctorId == "") {
        errorMsg("医生信息为空");
        return false;
    }
    if (offline.patientList.id == "") {
        errorMsg("患者信息为空");
        return false;
    }
    if (offline.lately.latelyId == "") {
        errorMsg("预约信息为空");
        return false;
    }


    var parments = {};
    if (isWeiXin()) {
        parments = {
            "payType": "weixinpay_jsapi",
            "couponId": offline.tickets.id,
            "settingsId": offline.lately.latelyId,
            "fromType": "weixin",
            "patientId": offline.patientList.id
        };
    }
    else {
        parments = {
            "payType": "weixinpay_h5",
            "couponId": offline.tickets.id,
            "settingsId": offline.lately.latelyId,
            "fromType": "H5",
            "patientId": offline.patientList.id
        };
    }
    var api = '/api/order/appointment/save_apply.json';
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
                        var push = [];
                        push.push(recordId);
                        push.push(Math.floor(Math.random() * 900) + 100)
                        var json = JSON.stringify(push);
                        console.log(json);
                        var url = encodeURI(weixinUrl + "pages/diagnose/Payment/offnine-payment.html?parments=" + json);
                        success1SetTimeOut("", url);
                       // checkApi(recordId);
                        return false;
                    } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
                        // showToastTips("支付取消");
                        errorSetTimeOut("支付取消", "/pages/users/appoint.html");
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

function payInfo(_type) {
    if (_type == 1) {
        checkApi(offline.recordId);
    }
    else {
        setTimeout(function () {
            $(".drawer_screen").show();
            $(".drawer_box").show();
        }, 2500);
        window.location.href = offline.resetURL;
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
