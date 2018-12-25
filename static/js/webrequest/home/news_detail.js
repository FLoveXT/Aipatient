var news = {
    title: '',
    time: '',
    content: '',
    pics:[],
    userInfo: {
        avatar: '',
        username: '',
        jobName: '',
        depart: '',
        disease: '',
        medicalInstitutions: '',
        diseaseExpertise: [],
        fee: '',
        isAppointment: '',
        isInquiry:'',
    },
    id:'',
    doctorId: '',
    shareParments: {
        shareTitle: "",
        shareContent: "",
        shareImage: "",
        shareUrl: "",
    },
    shareWeiXin: {},//微信分享appid之类
    onlinebtn: '',
    ishaveKey: false,
    recordId:""
};

$(function () {
    Init();
})

/**
 *  初始化
 * */
function Init() {
    $(".footer-info").remove();
    var id = getQueryString("id");
    if (id == "" || id == undefined || id == null) {
        errorSetTimeOut("请求参数错误", "/");
        return false;
    }
    news.id = id;
    getContent();
}

/**
 *  获取文章详情
 * */
function getContent() {
    var api = '/api/doctor/news/' + news.id;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                news.content = data.content;
                news.pics = data.pics;
                news.time = data.time;
                news.title = data.title;
                var user = data.doctor;
                news.userInfo = {
                    avatar: user.image,
                    fee: user.fee,
                    depart: user.depart,
                    medicalInstitutions: user.medicalInstitutions,
                    jobName: user.titles,
                    name: user.name,
                   
                    isAppointment: user.isAppointment,
                    isInquiry: user.isInquiry,
                    diseaseExpertise: user.diseaseExpertise
                }
                news.doctorId = user.doctorId;
                news.shareParments.shareTitle = user.shareTitle;
                news.shareParments.shareImage = user.shareImage;
                news.shareParments.shareContent = user.shareContent;
                news.shareParments.shareUrl = user.shareUrl;
                $(".item-content").html(template('list-div', { list: news }));
                getifhaveOrder();
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  查询是否有订单
 * */
function getifhaveOrder() {
    var api = '/api/order/inquiry/get_going_inquiry.json';
    var parments = {
        doctorId: news.doctorId
    };
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                if (res.hasOwnProperty("data")) {
                    news.recordId = res.data.recordId;
                    news.onlinebtn = res.data.status;
                    news.ishaveKey = true
                } else {
                    news.recordId = "";
                    news.onlinebtn = "";
                    news.ishaveKey = false
                }
            }
            
        }
    })
}

function btngozixun() {
    var ishaveLine = news.userInfo.isInquiry;
    if (ishaveLine == false) {
        errorMsg("该医生暂未开通在线问诊功能");
        return false;
    }
    else {
        if (!news.ishaveKey) {
            var url = "/pages/diagnose/payment.html?doctorId=" + news.doctorId;
            loadSetTimeOut("", url);
            return false;
        }
        else {
            if (news.onlinebtn == "WAIT_BUYER_PAY") {
                var url = "/pages/diagnose/ai_detail.html?doctorId=" + news.doctorId + "&recordId=" + news.recordId;
                loadSetTimeOut("", url);
                return false;
            }
            else {
                var url = "/pages/users/inquiry.html";
                loadSetTimeOut("", url);
                return false;
            }
        }
    }
}

function btnyuyue() {
    if (!news.userInfo.isAppointment == false) {
        errorMsg("该医生暂未开通线下面诊预约功能");
        return false;
    }
    var url = "/pages/diagnose/offline.html?doctorId=" + news.doctorId;
    loadSetTimeOut("请稍等",url);
    return false;
}

function getShareApi() {
    var api = "/api/home/weixin_share_js.json";
    var parments = {
        shareURL: window.location.href
    };
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                news.shareWeiXin = data;
                wxConfigInit();
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}



function wxConfigInit() {
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: news.shareWeiXin.appId, // 必填，公众号的唯一标识
        timestamp: news.shareWeiXin.timeStamp, // 必填，生成签名的时间戳
        nonceStr: news.shareWeiXin.nonceStr, // 必填，生成签名的随机串
        signature: news.shareWeiXin.signature,// 必填，签名
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo']
    });

    share_link = news.shareParments.shareUrl;
    share_img = news.shareParments.shareImage;
    share_description = news.shareParments.shareContent;
    share_title = news.shareParments.shareTitle
    pengyouquan = share_title + "|" + share_description;



    wx.ready(function () {
        wx.showOptionMenu();//显示右上角按钮
        wx.onMenuShareTimeline({
            title: pengyouquan, // 分享标题
            link: share_link, // 分享链接
            imgUrl: share_img, // 分享图标
            success: function () {

            },
            cancel: function () {

            }
        });

        wx.onMenuShareQQ({
            title: share_title, // 分享标题
            desc: share_description, // 分享描述
            link: share_link, // 分享链接
            imgUrl: share_img, // 分享图标
            success: function () {
            },
            cancel: function () {

            }
        });

        wx.onMenuShareAppMessage({
            title: share_title, // 分享标题
            desc: share_description, // 分享描述
            link: share_link, // 分享链接
            imgUrl: share_img, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
            },
            cancel: function () {

            }
        });
    });
}


///发送给朋友
function ShareWXFriend() {
    wx.onMenuShareAppMessage({
        title: share_title, // 分享标题
        desc: share_description, // 分享描述
        link: share_link, // 分享链接
        imgUrl: share_img, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
        },
        cancel: function () {

        }
    });
}

function ShareQQ() {
    wx.onMenuShareQQ({
        title: share_title, // 分享标题
        desc: share_description, // 分享描述
        link: share_link, // 分享链接
        imgUrl: share_img, // 分享图标
        success: function () {

        },
        cancel: function () {

        }
    });
}

function ShareWXZone() {
    wx.onMenuShareTimeline({
        title: share_title, // 分享标题
        link: share_link, // 分享链接
        imgUrl: share_img, // 分享图标
        success: function () {

        },
        cancel: function () {

        }
    });
}