
//我的优惠券.js

var type = "0"; //滑动加载使用,默认未使用的INIT -0

//未使用
var noArray = {
    noList: [],
    pageIndex: 1,
    pageSize: 10,
    isDisabled: false
};

//已过期
var yesArray = {
    yesList: [],
    pageIndex: 1,
    pageSize: 10,
    isDisabled: false
};


/**
 *  获取未使用优惠券数据
 * */
function getNoList() {
    var parments = {
        pageNum: noArray.pageIndex,
        pageSize: noArray.pageSize,
        type: "INIT",

    };
    new getRequest({
        url: "/api/coupon/list.json",
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                noArray.noList = noArray.noList.concat(res.data);
                noArray.isDisabled = res.page.pageCount > noArray.pageIndex ? true : false;
                $(".no-list").html(template('no-div', { list: noArray.noList }))
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

//已过期
function getyesList() {
    var parments = {
        pageNum: yesArray.pageIndex,
        pageSize: yesArray.pageSize,
        type: "EXPIRE",

    };
    new getRequest({
        url: "/api/coupon/list.json",
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                yesArray.yesList = yesArray.yesList.concat(res.data);
                yesArray.isDisabled = res.page.pageCount > yesArray.pageIndex ? true : false
                $(".yes-list").html(template('yes-div', { list: yesArray.yesList }))
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  用来默认显示List
 *  */
function showList() {
    $(".ticket").eq(0).show();
    $(".ticket").eq(!0).hide();
    $(".tab-list").find("div").eq(0).addClass("active");
    $(".tab-list").find("div").eq(!0).removeClass("active");
}

/**
 *  点击tab切换
 * */
function ticketClick(_index) {
    $(".ticket").eq(_index).show();
    $(".ticket").eq(!_index).hide();
    $(".tab-list").find("div").eq(_index).addClass("active");
    $(".tab-list").find("div").eq(!_index).removeClass("active");
}

$(function () {


    getNoList();//未使用
    getyesList();//已过期
    showList();
})

$(window).scroll(function () {
    if ($(document).scrollTop() + $(window).height() >= $(document).height() - 50) {
        if (type == 0) {
            if (!noArray.isDisabled) {
                this.console.log("未使用没有更多数据,无法加载");
                return false;
            }
            noArray.pageIndex = (noArray.pageIndex) + 1;
            this.getNoList();
            return false;
        }
        else {
            if (!yesArray.isDisabled) {
                this.console.log("已过期没有更多数据,无法加载");
                return false;
            }
            yesArray.pageIndex = (yesArray.pageIndex) + 1;
            this.getyesList();
            return false;
        }
    }
});