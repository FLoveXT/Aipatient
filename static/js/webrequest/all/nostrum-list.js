
// 秘方列表.js
var swiperList = [];
var nostrumList = [];
/**
 *  获取秘方列表的图片数据
 * */
function getSwiper() {
    new getRequest({
        url: "/api/secret_recipe/ad.json",
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                swiperList = res.advert;
                $(".swiper-wrapper").html(template('swiper-div', { list: swiperList }))
                var indexswiper = new Swiper('.index-container', {
                    pagination: {
                        el: '.swiper-pagination',
                    },
                    autoplay: true
                });
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function getNostrRum() {
    new getRequest({
        url: "/api/secret_recipe/list.json",
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                nostrumList = res.data;
                $(".list-item-nostrum").html(template('list-div', { list: nostrumList }))
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  跳转
 * */
function switchItemClick(_id) {
    window.location.href = "detail.html?noId=" + _id;
}

$(function () {
    getSwiper();

    getNostrRum();

    $(document).on(".item-list", "click", function () {
       
    });


    $(".icon03").addClass("icon03-on");
})