
var advert = [];//广告内容集合
var diseaes = [];//疾病集合
var departs = [];//科室集合
var diseaes_departs = 0;//为0显示不适列表 为其他显示科室列表
var doctorList = [];//医生推荐列表
var doctorIndex = 1;
var doctorSize = 5;
var doctorDisabled = false;
var messageNum = 0;


/**
 * 获取首页广告内容、不适、科室内容和未读消息数量
 * */
function getIndexJson() {
    new getRequest({
        url: "/api/home/index.json",
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                advert = res.advert;
                diseaes = res.diseaes;
                departs = res.departs;
                $(".swiper-ad-list").html(template('swiper-div', { list: advert }))
                $(".index-item02-list-diseaes").html(template('diseaes-div', { list: diseaes }))
                $(".index-item02-list-departs").html(template('departs-div', { list: departs }))

                new Swiper('.index-container', {
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

/**
 *  获取医生推荐列表
 * */
function getIndexDoctorList() {
    var parments = {
        pageNum: doctorIndex,
        pageSize: doctorSize
    };
    new getRequest({
        url: "/api/doctor/list_recommend.json",
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                doctorList = doctorList.concat(res.data);
                doctorDisabled = res.page.pageCount > doctorIndex ? true : false
                $(".doctor-list").html(template('doctorlist-div', { list: doctorList }))
                setTimeout(function(){
                    $(".doctor-list .img").each(function(){
                         var src=$(this).attr("src");
                         if(!src){
                            $(this).lazyLoad();
                         }
                    });    
                });
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  显示疾病或科室列表
 * */
function getShowList() {
    $(".index-item02").each(function () {
        var index = $(this).attr("data-index");
        if (index == diseaes_departs) {
            $(this).show();
            $(".tab-list").find("div").eq(index).addClass("active");
            return false;
        }
        else {
            $(this).hide();
            $(".tab-list").find("div").eq(!index).removeClass("active");
            return false;
        }
    });
}

/**
 *  点击不适或科室
 * */
function getClickListShow(that) {
    var index = that;
    $(".index-item02").eq(that).show();
    $(".index-item02").eq(!that).hide();
    $(".tab-list").find("div").eq(that).addClass("active");
    $(".tab-list").find("div").eq(!that).removeClass("active");
}

/**
 * 获取首页消息未读量
 *  */
function getMessageNum() {
    new getRequest({
        url: "/api/message/unread_num.json",
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                messageNum = res.data;
                $(".message-num").text(messageNum);
                /*判断消息数量 为0  不显示*/
                console.log($(".message-num").text())
                if($(".message-num").text()=="0"){
                    $(".message-num").hide()
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
 * 跳转到医生主页
 * */
function navigatorDoctor(_id) {
    var url = "/pages/home/doc_page.html?doctorId=" + _id;
    window.location.href = url;
}

/**
 * 首页轮播图点击跳转
 * @param {any} _this
 */
function swiper_url(_this) {
    var url = $(_this).attr("data-url");
    loadSetTimeOut("请稍等.正在跳转",url);
}

/**
 *  疾病列表点击事件
 * */
function diseaseClick(_this, _id, _name) {
    var url = "/pages/home/doctor.html?types=disease&id=" + _id + "&name=" + _name + "&more=true";
    loadSetTimeOut("请稍等.正在跳转", url);
}

/**
 *  科室列表点击事件
 * */
function departClick(_this, _id, _name) {
    var url = "/pages/home/doctor.html?types=keshi&id=" + _id + "&name=" + _name;
    loadSetTimeOut("请稍等.正在跳转", url);
}

/**
 *  按不适,科室 查看更多
 * @param {any} _type
 */
function QueryMoreClick(_type) {
    var url = "";
    if (_type == 1) {
        url = "/pages/home/disease.html";
    }
    else {
        url = "/pages/home/department.html";
    }
    loadSetTimeOut("请稍等.正在跳转", url);
}

/**
 *   找医生,智能寻医
 * */
function FindDoctorInfo() {
    var url = "/pages/diagnose/ai_doctor01.html";
    loadSetTimeOut("请稍等.正在跳转", url);
}

/**
 *  未读消息
 * */
function MessageInfo() {
    var url = "/pages/users/message.html";
    loadSetTimeOut("请稍等.正在跳转", url);
}

$(function () {

    getIndexJson();

    getShowList();

    getIndexDoctorList();

    getMessageNum();

    $(".icon01").addClass("icon01-on");
})

$(window).scroll(function () {
    if ($(document).scrollTop() + $(window).height() >= $(document).height() - 50) {
        if (!doctorDisabled) {
            return;
        }
        doctorIndex = (doctorIndex) + 1;
        console.log(doctorIndex);
        this.getIndexDoctorList();
    }
});