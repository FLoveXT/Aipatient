
/**
 * 主要业务逻辑相关
 */
var userUID;
/**
 * 实例化
 * @see module/base/js
 */
var yunXin;

$(function () {
    $(".footer-info").remove();

    $(".prev-icon ").click(function () {
        delCookie("avatar");
        delCookie("nickName");
        delCookie("sdktoken");
        delCookie("uid");
        loadSetTimeOut("", "/pages/users/inquiry.html");
    });

    delCookie("avatar");
    delCookie("nickName");
    delCookie("sdktoken");
    delCookie("uid");

    $(".more-add").click(function () {
        var flag = ai_detail.moreBtn;
        if (flag == false) {
            ai_detail.moreBtn = true;
            $(".more-subcontent").show("snow");
        }
        else {
            ai_detail.moreBtn = false;
            $(".more-subcontent").hide("snow");
        }
    });

    //回车绑定  
    $(".input-value").keydown(function (event) {
        if (event.keyCode == "13") {
            var value = $(this).val();
            SendMsg(value);
        }
    });

    Init();
})


var ai_detail = {
    recordId: '',//记录ID
    usertoken: '',//用户TOKEN
    useraccid: '',//用户ID
    doctoraccid: '',//医生ID
    chatTo: '',//医生ID
    messageArr: [],
    moreBtn: false,
    myPic: '',
    doctorPic: '',
    isSuccessWrite: false,
    step: '',
    two_step: '',
    template: '',
    doctorId: ''
};

function Init() {
    yunXin = null;
    window.nim = {};
    delCookie('uid');
    delCookie('sdktoken');
    delCookie('nickName');
    var recordId = getQueryString("recordId");
    if (recordId == undefined || recordId == "" || recordId == null) {
        loadbackUrlTimeOut("请求参数错误")
        return false;
    }
    ai_detail.recordId = recordId;
    setTimeout(function () {
        getAccessToken();//获取Token
    }, 500);


}

function getAccessToken() {
    var parmets = {
        inquiryId: ai_detail.recordId
    };
    new getRequest({
        url: "/api/inquiry/im_accid_token.json",
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var status = res.data.business_status;
                if (status == 1) {
                    $(".chatinput-wrapper").remove();
                    return false;
                }
                else {
                    ai_detail.doctoraccid = res.data.im_doctor_accid;
                    ai_detail.usertoken = res.data.im_token;
                    ai_detail.useraccid = res.data.im_accid;
                    ai_detail.chatTo = res.data.im_doctor_accid;
                    ai_detail.doctorId = res.data.im_doctor_id;
                    setCookie('uid', ai_detail.useraccid.toLocaleLowerCase());
                    setCookie('sdktoken', ai_detail.usertoken);
                    userUID = ai_detail.useraccid;
                    console.log("UID:" + readCookie("uid"));
                    showLoaders("正在加载IM,请稍等");
                    setTimeout(function () {
                        yunXin = new YX(ai_detail.useraccid);
                        setTimeout(function () {
                            console.log(yunXin);
                            connectSDK();


                        });
                    }, 500);


                }
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function connectSDK() {
    try {
        var config = window.CONFIG;
        var appKey = config.appkey;
        var account = ai_detail.useraccid;
        var token = ai_detail.usertoken;
        window.nim = SDK.NIM.getInstance({
            appKey: appKey,
            account: account,
            token: token,
            onconnect: function () {
                showLoaders("IM加载完毕,请稍等");
                showLoaders("正在加载聊天记录,请稍等");
                setTimeout(function () {
                    getHistoryRecord();
                    showAvatar();
                    setTimeout(function () {
                        getisWriteSuccess();
                    }, 500);
                }, 500);
            },
            ondisconnect: function (obj) {
                console.log('SDK 连接断开', obj)
            },
            onerror: function (error) {
                console.log('SDK 连接失败', error)
            }
        })
    } catch (error) {
        loadSetTimeOut("SDK错误.请联系管理员", "/");
        return false;
    }
}


/**
 *  获取历史记录
 * */
function getHistoryRecord() {
    showLoaders("正在获取云端记录..请稍等");
    nim.getHistoryMsgs({
        scene: 'p2p',
        to: ai_detail.chatTo,
        asc: true,
        done: function (error, obj) {
            if (error) {
                console.log(error);
                delCookie('uid');
                delCookie('sdktoken');
                delCookie('nickName');
                errorSetTimeOut(error, "/");
                return false;
            }
            getmessageInfoNext(obj.msgs, ai_detail.doctoraccid);
        }
    });
}

function getmessageInfoNext(objectList, im_doctorId) {

    try {
        showLoaders("正在解析云端记录..请稍等");
        let tempArr = [];
        if (objectList.length != 0) {
            let chatToMessageList = objectList;
            for (let time in chatToMessageList) {
                let msgType = chatToMessageList[time].type;
                if (msgType == "text") {
                    tempArr.push({
                        type: 'text',
                        text: chatToMessageList[time].text,
                        sendOrReceive: chatToMessageList[time].flow == "out" ? "send" : "receive",
                        displayTimeHeader: transTime(chatToMessageList[time].time) || '',
                        nodes: chatToMessageList[time].text,
                        isCustom: false,
                        customContent: {}
                    });
                }
                else if (msgType === 'image') {
                    tempArr.push({
                        type: 'image',
                        text: chatToMessageList[time].file.url,
                        time,
                        sendOrReceive: chatToMessageList[time].flow == "out" ? "send" : "receive",
                        displayTimeHeader: transTime(chatToMessageList[time].time) || '',
                        nodes: (chatToMessageList[time].file),
                        isCustom: false,
                        customContent: {}
                    })
                } else if (msgType == 'custom') {
                    var content = chatToMessageList[time].content;
                    var contentParse = JSON.parse(content);
                    var contentParseMsg = JSON.parse(contentParse.msg);
                    var contentpush = {
                        action: contentParseMsg.iyzy_action,
                        types: contentParseMsg.iyzy_msg_type,
                        singleid: contentParseMsg.iyzy_business_id,
                        title: contentParseMsg.iyzy_title,
                        doctorUrl: contentParseMsg.iyzy_doctor_app_url,
                        patientUrl: contentParseMsg.iyzy_patient_app_url
                    };
                    tempArr.push({
                        type: 'custom',
                        text: '',
                        time,
                        sendOrReceive: chatToMessageList[time].flow == "out" ? "send" : "receive",
                        displayTimeHeader: transTime(chatToMessageList[time].time) || '',
                        nodes: null,
                        isCustom: true,
                        customContent: contentpush
                    })
                }
            }

        }
        ai_detail.messageArr = tempArr;
        showLoaders("正在渲染云端记录..请稍等");
        $(".record-wrapper").html(template("div-message", { list: ai_detail.messageArr }))
        scroolBottom();//滑动滚动条
        $(".my-pic").attr("src", ai_detail.myPic);
        $(".doctor-pic").attr("src", ai_detail.doctorPic);
        setTimeout(function () {
            hideLoaders();
            zoomInfo();
        }, 500);
    }
    catch (error) {

    }
}

/**
 *  发送普通文本消息
 * */
function SendMsg(text) {
    nim.sendText({
        scene: 'p2p',
        to: ai_detail.doctoraccid,
        text: text,
        done: function (error, msg) {
            if (error) {
                errorMsg(error);
                return false;
            }
            let displayTimeHeader = judgeOverTwoMinute(msg.time)
            var array = ai_detail.messageArr;
            ai_detail.messageArr = [...ai_detail.messageArr, {
                text,
                type: 'text',
                sendOrReceive: 'send',
                displayTimeHeader: transTime(msg.time),
                node: text,
                isCustom: false,
                customContent: {}
            }]
            $(".input-value").val("");
            console.log(ai_detail.messageArr);
            $(".record-wrapper").html(template("div-message", { list: ai_detail.messageArr }));
            $(".my-pic").attr("src", ai_detail.myPic);
            $(".doctor-pic").attr("src", ai_detail.doctorPic);
            scroolBottom();//滑动滚动条
            setTimeout(function () {
                hideLoaders();
                zoomInfo();
            }, 500);
        }
    });
}

function judgeOverTwoMinute(time) {
    let displayTimeHeader = ''
    let lastMessage = ai_detail.messageArr[ai_detail.messageArr.length - 1]
    if (lastMessage) { //拥有上一条消息
        let delta = time - lastMessage.time
        if (delta > 2 * 60 * 1000) { //两分钟以上
            displayTimeHeader = transTime(time)
        }
    } else { //没有上一条消息
        displayTimeHeader = transTime(time)
    }
    console.log(displayTimeHeader);
    return displayTimeHeader;
}




/**
 *  jQ自动让滚动条滑动到最底部
 * */
function scroolBottom() {
    var scrollHeight = $('#recordWrapper').prop("scrollHeight");
    $('html,body').animate({ scrollTop: scrollHeight }, 1500);
}

/**
 *  显示头像=和横条名字
 * */
function showAvatar() {

    nim.getUser({
        account: ai_detail.chatTo,
        done(err, user) {
            if (err) {
                errorMsg("获取对方资料失败");
                console.log("获取对方资料失败");
                return false;
            }
            //设置seo-title
            console.log("===显示头像");
            console.log(user);
            let chatToLogo = '';
            if (user["avatar"]) {
                ai_detail.doctorPic = user.avatar
            }
            else {
                ai_detail.doctorPic = "../../static/images/default-icon.png";
            }

            var nick = user["nick"];
            var value = "和" + nick + "聊天中";
            $("header span").text(value);
        }
    })
}

function getisWriteSuccess() {
    var url = "/api/interrogation/getStep/" + ai_detail.recordId;
    new getRequest({
        url: url,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                var step = data.step;
                ai_detail.isSuccessWrite = step == 0 ? true : false;
                ai_detail.step = step;
                ai_detail.two_step = data.two_step;
                ai_detail.template = data.template

                if (!ai_detail.isSuccessWrite) {
                    $(".is-success").show();
                }
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function getUrl() {
    if (ai_detail.isSuccessWrite) {
        return false;
    }

    if (ai_detail.step == 1) {
        var url = "/pages/diagnose/part01.html?recordId=" + ai_detail.recordId + "&islast=0&doctorId=" + ai_detail.doctorId;
        loadSetTimeOut("请稍等", url)
        return false;
    }
    else {
        if (ai_detail.template == "儿童") {
            var url = "/pages/diagnose/child_step01.html?recordId=" + ai_detail.recordId;
            loadSetTimeOut("请稍等", url)
            return false;
        }
        else {
            var url = "/pages/diagnose/step01.html?recordId=" + ai_detail.recordId;
            loadSetTimeOut("请稍等", url)
            return false;
        }
    }
}


function receiveChange() {
    var url = '/pages/home/doc_page.html?doctorId=' + ai_detail.doctorId
    loadSetTimeOut("请稍等", url)
    return false;
}

function sendImages() {
    SDKBridge.prototype.sendFileMessage = function (scene, to, fileInput, callback) {
        var that = this,
            value = fileInput.value,
            ext = value.substring(value.lastIndexOf('.') + 1, value.length),
            type = /png|jpg|bmp|jpeg|gif/i.test(ext) ? 'image' : 'file';
        this.nim.sendFile({
            scene: scene,
            to: to,
            type: type,
            fileInput: fileInput,
            uploadprogress: function (data) {
                console && console.log(data.percentageText);
            },
            uploaderror: function () {
                errorMsg("上传图片失败");
                return false;
            },
            uploaddone: function (error, file) {
                console.log(error);
                console.log(file);
                console.log('上传' + (!error ? '成功' : '失败'));
            },
            beforesend: function (msgId) {
                console && console.log('正在发送消息, id=' + msgId);
            },
            done: callback
        });
    };
}

function uploadImage(_this) {
    console.log($(_this).val());
    var value = $(_this).val();
    var that = this,
        ext = value.substring(value.lastIndexOf('.') + 1, value.length),
        type = "image";
    nim.sendFile({
        scene: "p2p",
        to: ai_detail.chatTo,
        type: type,
        fileInput: _this,
        uploadprogress: function (data) {
            console && console.log(data.percentageText);
        },
        uploaderror: function () {
            console && console.log('上传失败');
        },
        uploaddone: function (error, file) {
            console.log(error);
            console.log(file);
            console.log('上传' + (!error ? '成功' : '失败'));
        },
        beforesend: function (msgId) {
            console && console.log('正在发送消息, id=' + msgId);
        },
        done: function (error, msg) {
            if (error) {
                errorMsg(error);
                return false;
            }
            console.log(msg);
            let displayTimeHeader = judgeOverTwoMinute(msg.time)
            var array = ai_detail.messageArr;
            var imgsrc = msg.file.url;
            ai_detail.messageArr = [...ai_detail.messageArr, {
                text: imgsrc,
                type: 'image',
                sendOrReceive: 'send',
                displayTimeHeader: transTime(msg.time),
                node: '',
                isCustom: false,
                customContent: {}
            }]
            $(".input-value").val("");
            console.log(ai_detail.messageArr);
            $(".record-wrapper").html(template("div-message", { list: ai_detail.messageArr }));
            ai_detail.moreBtn = false;
            $(".more-subcontent").hide("snow");
            $(".my-pic").attr("src", ai_detail.myPic);
            $(".doctor-pic").attr("src", ai_detail.doctorPic);
            scroolBottom();//滑动滚动条
            setTimeout(function () {
                hideLoaders();
                zoomInfo();
            }, 500);
        }
    });
}

function getDoctorPage() {

}

function customMessageUrl(_this) {
    var id = $(_this).attr("data-id");
    var types = $(_this).attr("data-type");
    if (types == "01") {
        showOrderDetail(id);
        //  loadSetTimeOut("请稍等", url);
        return false;
    }
    else if (types == "02") {
        getOrderDetailInfo(id);
    }
    else if (types == "03") {
        var downpath = dataset.patienturl;
        loadSetTimeOut("请稍等", url);
        return false;
    }
}

function getOrderDetailInfo(_id) {
    var api = "/api/order/my/jump/" + _id;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                switch (res.data.jump) {
                    case 0:
                        var url = "/pages/diagnose/medicine.html?orderId=" + _id;
                        loadSetTimeOut("", url);
                        break;
                    case 1:
                    case 2:
                    case 3:
                        var url = '/pages/users/order_details.html?orderId=' + _id + '&status=0' + res.data.jump;
                        loadSetTimeOut("", url);
                        break;
                }
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function showOrderDetail(_orderID) {
    var url = "/pages/diagnose/detail.html?recordId=" + _orderID;
    layer.open({
        type: 2,
        title: false,
        shadeClose: true,
        closeBtn: 1, //不显示关闭按钮
        area: ['90%', '90%'],
        anim: 2,
        scrollbar: false,
        btn: ["确定"],
        content: [url], //iframe的url，no代表不显示滚动条
    });
}

pushHistory();
function pushHistory() {
    if (!isWeiXin()) {
        return false;
    }
    var state = {
        title: "title",
        url: "#"
    };
    window.history.pushState(state, "title", "#");
};
window.onpopstate = function () {
    if (!isWeiXin()) {
        return false;
    }
    delCookie('uid');
    delCookie('sdktoken');
    delCookie('nickName');
    loadSetTimeOut("", "/pages/users/inquiry.html");
};


/**
 *  接收消息
 * */
function ReceiveMessage(msg) {
    let tempArr = ai_detail.messageArr;
    let msgType = msg.type;
    if (msgType == "text") {
        tempArr.push({
            type: 'text',
            text: msg.text,
            sendOrReceive: msg.flow == "out" ? "send" : "receive",
            displayTimeHeader: transTime(msg.time) || '',
            nodes: msg.text,
            isCustom: false,
            customContent: {}
        });
    }
    else if (msgType === 'image') {
        tempArr.push({
            type: 'image',
            text: msg.file.url,
            sendOrReceive: msg.flow == "out" ? "send" : "receive",
            displayTimeHeader: transTime(msg.time) || '',
            nodes: (msg.file),
            isCustom: false,
            customContent: {}
        })
    } else if (msgType == 'custom') {
        var content = msg.content;
        var contentParse = JSON.parse(content);
        var contentParseMsg = JSON.parse(contentParse.msg);
        var contentpush = {
            action: contentParseMsg.iyzy_action,
            types: contentParseMsg.iyzy_msg_type,
            singleid: contentParseMsg.iyzy_business_id,
            title: contentParseMsg.iyzy_title,
            doctorUrl: contentParseMsg.iyzy_doctor_app_url,
            patientUrl: contentParseMsg.iyzy_patient_app_url
        };
        tempArr.push({
            type: 'custom',
            text: '',
            sendOrReceive: msg.flow == "out" ? "send" : "receive",
            displayTimeHeader: transTime(msg.time) || '',
            nodes: null,
            isCustom: true,
            customContent: contentpush
        })
    }
    ai_detail.messageArr = tempArr;
    $(".record-wrapper").html(template("div-message", { list: ai_detail.messageArr }))
    scroolBottom();//滑动滚动条
    $(".my-pic").attr("src", ai_detail.myPic);
    $(".doctor-pic").attr("src", ai_detail.doctorPic);
    setTimeout(function () {
        hideLoaders();
        zoomInfo();
    }, 500);
}

