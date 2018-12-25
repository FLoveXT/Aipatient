//秘方详情.js
var nostrumId = "";
var Indications = "";//功能主治
var Secretintroduction = "";//秘方介绍
var doctor_introduce = "";//医生简介
var cases = "";//康复案例
var doctorId = "";//医生ID
var isInquiry = false;//是否开通在线问诊
var recordId = "";//记录ID
var onlinebtn = "";//链接内容
var ishaveKey = false;//是否包含key
var titles = "";
/**
 *  获取秘方详情
 *  */
function getDetail() {
    var nostId = getQueryString("noId");
    if (nostId == "" || nostId == undefined || nostId == null) {
        errorMsg("对不起,获取参数失败");
        return false;
    }
    nostrumId = nostId;
    var api = "/api/secret_recipe/" + nostId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                titles = res.data.title;
                cases = res.data.cases;//康复案例
                doctorId = res.data.doctorId;//医生ID
                doctor_introduce = res.data.doctor_introduce;//医生简介
                Indications = res.data.function;//功能主治
                Secretintroduction = res.data.doctor_introduce;//秘方介绍
                isInquiry = res.data.isInquiry;//是否开通在线问诊
                $(".req-function").html(Indications);
                $(".req-introduce").html(Secretintroduction);
                $(".req-doctor_introduce").html(doctor_introduce);
                $(".req-cases").html(cases);
                $(".req-title").html(titles);
                getIfhaveOrder();
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  判断用户与医生是否有订单记录
 * */
function getIfhaveOrder() {
    var parments = {
        doctorId: doctorId
    };
    new getRequest({
        url: "/api/order/inquiry/get_going_inquiry.json",
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                if (res.hasOwnProperty("data")) {
                    recordId = res.data.recordId;
                    onlinebtn = res.data.status;
                    ishaveKey = true;
                } else {
                    recordId = "";
                    onlinebtn = "";
                    ishaveKey = false;
                }
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  在线问诊点击链接
 * */
function onlineClick() {
    if (isInquiry == false) {
        $(".req-online").attr("href", "javascript:void(0)");
        return false;
    }
    else {
        if (!ishaveKey) {
            //跳转到购买在线问诊页面
            var url = "/pages/diagnose/payment.html?doctorId=" + doctorId;
            loadSetTimeOut("请稍等", url);
            return false;
        }
        else {
            if (onlinebtn == "WAIT_BUYER_PAY") {
                //跳转到问诊详情IM
                var url = "/pages/diagnose/ai_detail.html?recordId=" + recordId;
                loadSetTimeOut("请稍等", url);
                return false;
            } else {
                //跳转到在线问诊订单列表页
                var url = "/pages/users/inquiry.html";
                loadSetTimeOut("请稍等", url);
                return false;
            }
        }
    }
}

$(function () {
    getDetail();

    $(".icon03").addClass("icon03-on");
})