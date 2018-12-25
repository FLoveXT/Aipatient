var appraise = {
    all: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        List:[],
    }
    ,
    online: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        List: [],
    },
    down: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        List: [],
    },
    cn: {
        pageIndex: 1,
        pageSize: 10,
        disabled: false,
        List: [],
    },
    type:"all"
};

/**
 *  全部
 * */
function getAllRequest() {
    var parmets = {
        pageNum: appraise.all.pageIndex,
        pageSize: appraise.all.pageSize,
        businessType:''
    };
    new getRequest({
        url: "/api/appraise/list.json",
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                appraise.all.List = appraise.all.List.concat(res.data);
                appraise.all.disabled = res.page.pageCount > appraise.all.pageIndex ? true : false;
                $(".all-list").html(template('list1-div', { list: appraise.all.List }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  在线问诊
 * */
function getOnlineRequest() {
    var parmets = {
        pageNum: appraise.online.pageIndex,
        pageSize: appraise.online.pageSize,
        businessType: 'dr_inquiry'
    };
    new getRequest({
        url: "/api/appraise/list.json",
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                appraise.online.List = appraise.online.List.concat(res.data);
                appraise.online.disabled = res.page.pageCount > appraise.online.pageIndex ? true : false;
                $(".online-list").html(template('list2-div', { list: appraise.online.List }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  线下面诊
 * */
function getDownRequest() {
    var parmets = {
        pageNum: appraise.down.pageIndex,
        pageSize: appraise.down.pageSize,
        businessType: 'dr_appointment'
    };
    new getRequest({
        url: "/api/appraise/list.json",
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                appraise.down.List = appraise.down.List.concat(res.data);
                appraise.down.disabled = res.page.pageCount > appraise.down.pageIndex ? true : false;
                $(".down-list").html(template('list3-div', { list: appraise.down.List }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  中药调理
 * */
function getCnRequest() {
    var parmets = {
        pageNum: appraise.down.pageIndex,
        pageSize: appraise.down.pageSize,
        businessType: 'dr_prescription'
    };
    new getRequest({
        url: "/api/appraise/list.json",
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                appraise.cn.List = appraise.cn.List.concat(res.data);
                appraise.cn.disabled = res.page.pageCount > appraise.cn.pageIndex ? true : false;
                $(".cn-list").html(template('list4-div', { list: appraise.cn.List }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function scoreChange(_this) {
    var orderid = $(_this).attr("data-orderid");
    var status = $(_this).attr("data-statusinfo");
    var url = '/pages/users/appraise_details.html?orderid=' + orderid + " &status=" + status;
    loadSetTimeOut("请稍等", url);
    return;
}

$(function () {

    getAllRequest();
    $(".item-list").eq(0).show();
    $(".tabs .tab").eq(0).addClass("active");

    $(".tabs .tab").click(function () {
        var value = $(this).attr("data-value");
        if (value == "all") {
            $(this).addClass("active").siblings().removeClass("active");
            appraise.all.List = [];
            appraise.all.pageIndex = 1;
            appraise.type = "all";
            getAllRequest();
            $(".item-list").hide().eq(0).show()
        }
        else if (value == "online") {
            $(this).addClass("active").siblings().removeClass("active");
            appraise.online.List = [];
            appraise.online.pageIndex = 1;
            appraise.type = "online";
            getOnlineRequest();
            $(".item-list").hide().eq(1).show()
        } 
        else if (value == "down") {
            $(this).addClass("active").siblings().removeClass("active");
            appraise.down.List = [];
            appraise.down.pageIndex = 1;
            appraise.type = "down";
            getDownRequest();
            $(".item-list").hide().eq(2).show()
        } 
        else if (value == "cn") {
            $(this).addClass("active").siblings().removeClass("active");
            appraise.cn.List = [];
            appraise.cn.pageIndex = 1;
            appraise.type = "cn";
            getCnRequest();
            $(".item-list").hide().eq(3).show()
        } 
    });
})


