var focus_info = {
    doctors: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        list: []
    },
    dynamic: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        list: []
    },
    type: 'doctor'
};

function Init() {
    $(".item-list").hide().eq(0).show()
    getFocusDoctor();
}

function getFocusDoctor() {
    var parmets = {
        pageNum: focus_info.doctors.pageIndex,
        pageSize: focus_info.doctors.pageSize
    };
    var api = '/api/follow/list_doctor.json';
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                if (data != undefined) {
                    focus_info.doctors.list = focus_info.doctors.list.concat(res.data);
                }
                if (res.hasOwnProperty("page")) {
                    focus_info.doctors.disabled = res.page.pageCount > focus_info.doctors.pageIndex ? true : false;
                }
                $(".doctor-list").html(template('doctor-div', { list: focus_info.doctors.list }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function getFocusDynamic() {
    var parmets = {
        pageNum: focus_info.dynamic.pageIndex,
        pageSize: focus_info.dynamic.pageSize
    };
    var api = '/api/follow/list_news.json';
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                focus_info.dynamic.list = focus_info.dynamic.list.concat(res.data);
                focus_info.dynamic.disabled = res.page.pageCount > focus_info.dynamic.pageIndex ? true : false;
                $(".dynamic-list").html(template('dynamic-div', { list: focus_info.dynamic.list }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

$(function () {
    Init();

    $(".tabs .tab").click(function () {
        var value = $(this).attr("data-value");
        if (value == "doctor") {
            $(this).addClass("active").siblings().removeClass("active");
            focus_info.doctors.pageIndex = 1;
            focus_info.doctors.list = [];
            focus_info.type = "new";
            getFocusDoctor();
            $(".item-list").hide().eq(0).show()
        } else {
            $(this).addClass("active").siblings().removeClass("active");
            focus_info.dynamic.pageIndex = 1;
            focus_info.dynamic.list = [];
            focus_info.type = "dynamic";
            getFocusDynamic();
            $(".item-list").hide().eq(1).show()
        }
    });

    $(window).scroll(function () {
        if ($(document).scrollTop() + $(window).height() >= $(document).height() - 50) {
            var type = focus_info.type;
            switch (type) {
                case "doctor":
                    if (!focus_info.doctors.disabled) {
                        return false;
                    }
                    focus_info.doctors.pageIndex = focus_info.doctors.pageIndex + 1;
                    getFocusDoctor();
                    console.log("doctor:" + focus_info.doctors.pageIndex);
                    break;
                case "dynamic":
                    if (!focus_info.dynamic.disabled) {
                        return false;
                    }
                    focus_info.dynamic.pageIndex = focus_info.dynamic.pageIndex + 1;
                    getFocusDynamic();
                    console.log("dynamic:" + focus_info.dynamic.pageIndex);
                    break;
            }
        }
    });

})

/**
 *  取消关注
 * */
function cancelFollower(id, index) {
    YDUI.dialog.confirm('取消关注提醒', '确定要取消关注吗?', function () {
        var api = '/api/follow/cancel_relation.json?doctorId=' + id;
        new putJsonRequest({
            url: api,
            isShowLoader: true,
            callBack(res) {
                if (res.code == 200) {
                    successSetTimeOut("取关成功", "/pages/users/focus.html");
                    return;
                }
                else {
                    errorMsg(res.message);
                    return false;
                }
            }
        })
    })
}

/**
 *  跳转
 * */
function navigationUrlDetail(id, types, doctorid) {
    var url = "";
    switch (types) {
        case "1":
            //跳转至健康科普详情页
            url = '/pages/home/news_detail.html?id=' + id;
            break;
        case "5":
            //跳转至动态详情页
            url = '/pages/home/news_detail.html?id=' + id;
            break;
        case "6":
            //跳转至公告详情页
            url = '/pages/home/news_detail.html?id=' + id;
            break;
        default:
            errorMsg("请求错误");
            return false;
    }
    loadSetTimeOut("", url);
    return;
}