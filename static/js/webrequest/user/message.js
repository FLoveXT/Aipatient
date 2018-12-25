var message = {
    pageIndex: 1,
    pageSize: 10,
    disabled: false,
    List: [],
    TransferId: ''
};
var time = 0;
var messageId = 0;
$(function () {
    $(".footer-info").remove();
    Init();
    $(".item-group").on("touchstart", function (e) {
        var id = $(this).attr("data-id");
        e.stopPropagation();
        time = setTimeout(function () {  
            YDUI.dialog.confirm('是否删除此条信息', '', function () {
                new putRequest({
                    url: "/api/message/remove/" + id,
                    isShowLoader: true,
                    callBack(res) {
                        if (res.code == 200) {
                            successMsg(res.message)
                        }
                        else {
                            errorMsg(res.message);
                            return false;
                        }
                    }
                })
            });
        },800);
    })

    $(".item-group").on("touchend", function (e) {
        e.stopPropagation();
        clearTimeout(time);
    })
})

function Init() {
    getMessageList();
}

/**
 *  标记单个为已读
 * */
function singleRead(messageId) {
    new putRequest({
        url: "/api/message/read/" + messageId,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                  
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  标记为已读
 * */
function buildRead() {
    new putRequest({
        url: "/api/message/read_all.json",
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                successMsg("标记为已读成功");
                hideMsg();
                window.location.reload()
                return;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  清空已读消息
 * */
function emptyRead() {
    new putRequest({
        url: "/api/message/empty_all.json",
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                successMsg("清空已读消息成功");
                message.pageIndex = 1;
                message.List = [];
                message.disabled = false;
                getMessageList();
                hideMsg();
                return;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}


//显示编辑按钮
function showMsg(){
    $(".msg-wrap").show()
}
//隐藏编辑按钮
function hideMsg(){
    $(".msg-wrap").hide()
}
/**
 *   获取消息列表
 * */
function getMessageList() {
    var parmets = {
        "pageNum": message.pageIndex,
        "pageSize": message.pageSize
    };
    new getRequest({
        url: "/api/message/list.json",
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var messageList = message.List.concat(res.data);
                message.List = messageList;
                $(".message-list").html(template('message-div', { list: message.List }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

$(window).scroll(function () {
    if ($(document).scrollTop() + $(window).height() >= $(document).height() - 50) {
        if (!message.disabled) {
            return false;
        }
        message.pageIndex = (message.pageIndex) + 1;
        getMessageList();
        console.log(message.pageIndex);
    }
});

/**
 *  点击事件
 * */
function messageBuildClick(_this) {
    var doctorName = $(_this).attr("data-doctorname");
    var doctorId = $(_this).attr("data-doctorid")
    var messageId = $(_this).attr("data-messageid")
    var businessId = $(_this).attr("data-businessid")
    var code = $(_this).attr("data-code");
    singleRead(messageId);//调用修改为已读,不管成功与否
    var url = "";
    switch (code) {
        case "101"://在线问诊 新的回复  跳转到对应的在线问诊页面
            url = '/pages/diagnose/ai_detail.html?doctorId=' + doctorId + '&recordId=' + businessId;
            break;
        case "102"://在线问诊 购买成功 跳转到我的问诊-最新问诊页面
            url = "/pages/users/inquiry.html";
            break;
        case "103"://在线问诊  转诊提醒 跳转到转单提醒弹出框
            isOpenDialog(messageId, doctorName);
            return false;
        case "104"://在线问诊  取消支付  跳转到我的问诊-问诊记录页面
            url = "/pages/users/inquiry.html?message=104";
            break;
        case "105": //在线问诊  在线问诊订单取消   跳转到我的问诊-问诊记录页面
            url = "/pages/users/inquiry.html?message=104";
            break;
        case "106"://在线问诊   服务超时退款   跳转到我的问诊-问诊记录页面
            url = "/pages/users/inquiry.html?message=104";
            break;
        case "107"://在线问诊  问诊时间调整提醒   跳转到我的问诊-最新问诊页面
            url = "/pages/users/inquiry.html";
            break;

        case "200"://推荐医生列表
            url = "/pages/home/doc_recommend.html";
            break;
        case "201"://线下面诊服务  跳转到我的预约-最新预约页面
            url = "/pages/users/appoint.html";
            break;
        case "202"://线下面诊服务   预约取消（医生）  跳转到我的预约-预约记录页面
            url = "/pages/users/appoint.html?message=202";
            break;
        case "203": //线下面诊服务  预约取消（患者）退钱  跳转到我的预约-预约记录页面
            url = "/pages/users/appoint.html?message=202";
            break;
        case "204"://线下面诊服务   预约取消（患者）不退钱   跳转到我的预约-预约记录页面
            url = "/pages/users/appoint.html?message=202";
            break;
        case "205"://线下面诊服务   预约取消（患者）未及时支付   跳转到我的预约-预约记录页面
            url = "/pages/users/appoint.html?message=202";
            break;
        case "206"://线下面诊服务 预约提醒   跳转到我的预约-最新预约页面
            url = "/pages/users/appoint.html";
            break;

        case "301"://中药调理订单  未支付订单   跳转到我的处方单-待支付订单页面
            url = "/pages/users/order.html?message=wait";
            break;
        case "302"://中药调理订单  已支付订单   跳转到我的处方单-已支付订单页面
            url = "/pages/users/order.html?message=record";
            break;

        case "401":
            url = "/pages/home/doc_news.html?id=" + doctorId;
            break;
        case "402"://医生动态   医生新的动态   跳转到我的关注-医生动态页
            url = "/pages/home/doc_page.html?doctorId=" + doctorId;
            break;
        case "404"://评价  未评价的服务  跳转到对应的评价页面
            url = "/pages/users/appraise.html";
            break;
        default:
            return false;
    }
    loadSetTimeOut("请稍等", url);
    return false;
}

var value = false;
var messageId = "";
function checkAttr(_this, _index, _value, _bool) {
    $(".checkbox").eq(_index).attr("checked", true);
    $(".checkbox").eq(!_index).removeAttr("checked", true);
    console.log(_value);
    value = _bool;
}

function btnConfirm() {
    EabledScroll();
    if (value) {
        $(".drawer_screen").hide("slow");
        $(".drawer_box").hide("slow");
    }
    else {
        if (!messageId) {
            $(".drawer_screen").hide("slow");
            $(".drawer_box").hide("slow");
        } else {
            var api = "/api/order/inquiry/referral/" + messageId + ".json";
            new putRequest({
                url: api,
                isShowLoader: true,
                callBack(res) {
                    if (res.code == 200) {
                        successMsg(res.message);
                    }
                    else {
                        errorMsg(res.message);
                        return false;
                    }
                }
            })
            $(".drawer_screen").hide("slow");
            $(".drawer_box").hide("slow");
        }

    }
}

/**
 *  查询是否弹窗
 * */
function isOpenDialog(_orderId, name) {
    var api = "/api/order/inquiry/referral_status/" + _orderId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                messageId = _orderId;
                $(".doctor-name").text(name);
                DisabledScroll();
                $(".drawer_screen").show("slow");
                $(".drawer_box").show("slow");
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}


