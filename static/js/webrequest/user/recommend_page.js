
var page = {
    title: '',
    content: '',
    imageUrl: '',
    url: '',
    shareTitle: '',
    shareContent: '',
    shareImage: '',
    share: {

    }
};
var share_link = "";
var share_img = "";
var share_description = "";
var share_title = "";
var pengyouquan = "";


$(function () {
    getRecPage();

    if (isWeiXin()) {
        getShareApi();
    }

    $(document).on(".-mob-share-weixin-qrcode-bg", "click", function () {
        
    });
})

function recUS() {
    goWeiXinOpenAmiat();
}

function closeBG() {
    $(".-mob-share-weixin-qrcode-bg").remove();
    $(".-mob-share-weixin-tips-content").remove();
}

/**
 *  提示用微信打开
 * */
function goWeiXinOpenAmiat() {
    var msg = "";
    if (!isWeiXin()) {
        msg = "用微信打开,点击右上角<br>将它分享到朋友圈<br>或指定的朋友";
    }
    else {
        msg = "点击右上角<br>将它分享到朋友圈<br>或指定的朋友";
    }
    var html = '<div class="-mob-share-weixin-qrcode-bg" onclick="closeBG()" style="opacity: 0.7; transition-property: all; transition-duration: 0s;"></div>';
    html += '<div class="-mob-share-weixin-tips-content" style="opacity: 1; transition-property: all; transition-duration: 0s;"><div class="-mob-share-weixin-tips-arrow"></div><div class="-mob-share-weixin-tips">' + msg + '</div></div>';
    $("body").append(html);
}


function getRecPage() {
    var api = "/api/home/recommend_page.json";
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                page.title = data.title;
                page.content = data.content;
                page.imageUrl = data.imagesUrl;
                page.url = data.url;
                page.shareTitle = data.shareTitle;
                page.shareContent = data.shareContent;
                page.shareImage = data.shareImage
                $(".page-info").html(template("page-div", { list: page }));
                setTimeout(function () {
                    zoomInfo(); 
                },500);
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
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
                page.share = data;
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
        appId: page.share.appId, // 必填，公众号的唯一标识
        timestamp: page.share.timeStamp, // 必填，生成签名的时间戳
        nonceStr: page.share.nonceStr, // 必填，生成签名的随机串
        signature: page.share.signature,// 必填，签名
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo']
    });

    share_link = page.url;
    share_img =  page.shareImage;
    share_description =page.shareContent;
    share_title = page.shareTitle;
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