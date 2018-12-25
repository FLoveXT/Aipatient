//购买-我的优惠券.js
var ticket = {
    types: '',
    fee: '',
    id: '',
    ticketList: [],
    sourceFee: '',
    businessId: ''
};

$(function () {

    $("body").addClass("active");
    $(".footer-info").remove();
    Init();

})

/**
 *  初始化
 * */
function Init() {

    console.log(1);
    var types = getQueryString("types");
    if (types == null || types == undefined || types == "") {
        errorSetTimeOut("请求类型参数错误", "/")
        return false;
    }

    var fee = getQueryString("fee");
    if (fee == null || fee == undefined || fee == "") {
        errorSetTimeOut("必传类型参数错误", "/")
        return false;
    }

    var businessIds = getQueryString("businessId");
    if (businessIds) {
        ticket.businessId = businessIds;
    }

    ticket.fee = fee;
    ticket.types = types;
    getList();
}

function noUsingTicketInfo(_this) {
    ticketArray = {
        isSelected: true,
        payId: '',
        name: '',
        fee: 0.01,
        isNoBuy: true,//不选择优惠券选择项
    }
    $(_this).addClass("active-s");
    $(".ticket-list .list").removeClass("active");
}

/**
 *  加载优惠券列表
 * */
function getList() {
    var parments = {};

    if (ticket.businessId == '') {
        parments = {
            businessType: ticket.types,
            fee: ticket.fee
        };
    }
    else {
        parments = {
            businessType: ticket.types,
            fee: ticket.fee,
            businessId: ticket.businessId
        };
    }

    new getRequest({
        url: "/api/coupon/available_coupons.json",
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                ticket.ticketList = res.data;
                console.log(ticket.ticketList);
                $(".ticket-list").html(template('ticket-div', { list: ticket.ticketList }))
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  优惠券点击事件
 * */
function ticketClick(_this) {
    ticketArray.isSelected = false;
    ticketArray.payId = '';
    ticketArray.name = '';
    var payId = $(_this).attr("data-pay");
    var name = $(_this).attr("data-name");
    ticketArray.isSelected = true;
    ticketArray.name = name;
    ticketArray.payId = payId;
    $(".nousing").removeClass("active-s");
    $(_this).addClass("active").siblings().removeClass("active");
}


var ticketArray = {
    isSelected: false,
    payId: '',
    name: '',
    fee: 0.01,
    isNoBuy: false,//不选择优惠券选择项
}

