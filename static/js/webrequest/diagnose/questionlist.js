
//我的问诊.js
var queryInfo = {
    list: [],
    doctorId: ''
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
    queryInfo.doctorId = doctorId;
    getList();
}

/**
 *  获取该医生的问诊列表
 * */
function getList() {
    var parments = {
        doctorId: queryInfo.doctorId
    };
    new getRequest({
        url: "/api/inquiry/list_settings.json",
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                queryInfo.list = res.data;
                $(".queryinfo-list").html(template('queryinfo-div', { list: queryInfo.list }))
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 * 问诊点击回传值
 * */
function settingClick(_this) {
    valueInfo.fee = '';
    valueInfo.time = '';
    valueInfo.num = '';
    valueInfo.id = '';
    valueInfo.isSelected = false;
    var num = $(_this).attr("data-num");
    var time = $(_this).attr("data-time");
    var fee = $(_this).attr("data-fee");
    var id = $(_this).attr("data-id");
    valueInfo.fee = fee;
    valueInfo.time = time;
    valueInfo.num = num;
    valueInfo.id = id;
    valueInfo.isSelected = true;
  //  $(_this).addClass("active").siblings().removeClass("active");
    var value = valueInfo;
    parent.paymentInfo.settings.time = value.time;
    parent.paymentInfo.settings.num = value.num;
    parent.paymentInfo.settings.fee = value.fee;
    parent.paymentInfo.settings.settingId = value.id;
    parent.paymentInfo.tickets.requestId = "";
    parent.paymentInfo.tickets.id = "";
    parent.paymentInfo.tickets.name = "";
    parent.paymentInfo.sourceMoney = value.fee;
    parent.valueAssignment();
    parent.layer.closeAll();
}

var valueInfo = {
    num: '',
    time: '',
    fee: '',
    id: '',
    isSelected: false
};



$(function () {
    $(".footer-info").remove();

    Init();
})