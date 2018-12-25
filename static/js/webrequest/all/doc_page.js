var doctorInfo = {
    doctorId: '', //医生ID
    doctorAvatar: '', //医生头像信息
    doctorName: '', //医生姓名
    doctorJob: '', //医生职位信息
    doctorisRec: false, //是否推荐
    doctordepartment: '', //科室名称
    doctorpayNum: 0, //付款人数
    doctorRediagnosisRate: 0, //复诊率
    doctormedicalInstitutions: '', //医院机构名称
    doctorFee: 0, //收费价格
    doctorisonlineConsultation: false, //是否开通在线问诊
    doctorisLinebelowdiagnosis: false, //是否开通线下面诊
    announcementContent: '', //公告内容
    announcementTime: '', //公告时间,缺少公告标题
    announcementShow: false, //是否显示公告
    diseaseExpertise: [], //擅长调理
    introduce: '', //简介文字
    jobPhotos: [], //简介图片
    articles: [], //医生动态集合
    commentlist: [], //评价列表
    commentTotalCount: 0, //评价总数
    commentPageIndex: 1,
    commentPageSize: 10,
    commentIsDisabled: false, //是否加载更多按钮
    isFollow: false, //是否关注
    isHaveOrder: false,
    orderId: '',
    onlinebtn: '',
    ishaveKey: false,
    moreShow: false,
    allList: [], //全部擅长列表
    toggle: true,
    moreText: true,
    recordId: '',
    imgList: [] //资质图片展示
};
/**
 *  获取医生主页信息
 */
function getdoctorPageInfo() {
    var api = "/api/doctor/index/" + doctorInfo.doctorId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                for (var i in data.diseaseExpertise) {
                    doctorInfo.allList.push(data.diseaseExpertise[i]);
                }
                console.log(doctorInfo.allList);
                var dataList = data.diseaseExpertise;

                if (dataList.length > 6) {
                    doctorInfo.diseaseExpertise = dataList.splice(0, 5); //擅长调理
                    doctorInfo.moreShow = true;
                } else {
                    doctorInfo.diseaseExpertise = data.diseaseExpertise;
                    doctorInfo.moreShow = false;
                }
                console.log(doctorInfo.allList);

                doctorInfo.doctorAvatar = data.image; //医生头像信息
                doctorInfo.doctorName = data.name; //医生姓名
                doctorInfo.doctorJob = data.titles; //医生职位信息
                doctorInfo.doctorisRec = data.isRecommend; //是否推荐
                doctorInfo.doctordepartment = data.depart; //科室名称
                doctorInfo.doctorpayNum = data.number == null || data.number == undefined ? 0 : data.number; //付款人数
                doctorInfo.doctorRediagnosisRate = data.revisit == null || data.revisit == undefined ? 0 : data.revisit; //复诊率
                doctorInfo.doctormedicalInstitutions = data.medicalInstitutions;
                doctorInfo.doctorisonlineConsultation = data.isInquiry; //是否开通在线问诊
                doctorInfo.doctorisLinebelowdiagnosis = data.isAppointment; //是否开通线下面诊
                doctorInfo.introduce = data.introduce; //简介文字
                doctorInfo.jobPhotos = data.jobPhotos; //简介图片
                doctorInfo.isFollow = data.isFollow; //是否关注
                doctorInfo.doctorFee = data.fee; //所需费用
                doctorInfo.imgList = data.certificatePics; //资质查询
                if (data.articles != null) {
                    var array = [];
                    for (var i = 0; i < data.articles.length; i++) {
                        var text = data.articles[i].articleContent.substr(0, 35) + '...';
                        array.push({
                            title: text,
                            time: data.articles[i].articleTime,
                            types: data.articles[i].articleType,
                            id: data.articles[i].articleId
                        });
                    }
                    doctorInfo.articles = array;
                }

                if (!("announcementContent" in data) || !("announcementTime" in data)) {
                    doctorInfo.announcementShow = false;
                    doctorInfo.announcementContent = ""; //
                    doctorInfo.announcementTime = "";

                } else {
                    doctorInfo.announcementShow = true;
                    doctorInfo.announcementContent = data.announcementContent; //
                    doctorInfo.announcementTime = data.announcementTime;
                }
                getifhaveOrder();
                console.log(doctorInfo);
                //个人简介
                $(".doctor-info-page").html(template('doctor-info-div', { item: doctorInfo }))
                //关注
                $(".top-img").html(template('doctor-follower-div', { item: doctorInfo }));
                //在线问诊
                $(".online-div").html(template('doctor-online-div', { item: doctorInfo }));
                //约见线下面诊
                $(".down-cloud").html(template("doctor-down-div", { item: doctorInfo }));
                //if (!doctorInfo.doctorisLinebelowdiagnosis) {
                //    $(".doctorisLinebelowdiagnosis").remove();
                //}
                //医生公告
                $(".doctor-gg-list").html(template("doctor-gg-div", { item: doctorInfo }));
                //擅长调理
                $(".shanchang-list").html(template("doctor-shanchang-div", { item: doctorInfo }));
                //医生简介
                $(".search-list").html(template("doctor-searchdesc-div", { item: doctorInfo }));

                setTimeout(function(){
                    var descPx= $(".more-text").outerHeight();
                    if(descPx<=37){
                        $(".doctor-desc").remove();
                    }
                    
                },100);
               
                $(".query-list").html(template("query-div",{list:doctorInfo.imgList}));
                var indexswiper = new Swiper('.index-container', {
                    pagination: {
                        el: '.swiper-pagination',
                    },
                    autoplay: true
                });
              
                //医生动态
                $(".doctor-dynamic-list").html(template("doctor-dynamic-div", { item: doctorInfo }));
               
                getAllScore();//获取评价
                new Swiper('.index-container-1', {
                    pagination: {
                        el: '.swiper-pagination',
                    },
                    autoplay: true
                });
                
            } else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  获取全部评价信息
 * */
function getAllScore() {
    var parments = {
        pageNum: doctorInfo.commentPageIndex,
        pageSize: doctorInfo.commentPageSize
    };
    var url = "/api/doctor/appraise/" + doctorInfo.doctorId;
    new getRequest({
        url: url,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                doctorInfo.commentlist = doctorInfo.commentlist.concat(res.data);
                $(".doctor-comment-list").html(template('doctor-comment-div', { list: doctorInfo.commentlist }))
                doctorInfo.commentIsDisabled = res.page.pageCount > doctorInfo.commentPageIndex ? true : false;
                if (!doctorInfo.commentIsDisabled) {
                    $("#scoreMoreBtn").remove();
                }
                console.log(doctorInfo.commentlist);
                
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *   点击查看更多
 * */
function clickScoreMore() {
    if (!doctorInfo.commentIsDisabled) {
        return false;
    }
    doctorInfo.commentPageIndex = doctorInfo.commentPageIndex + 1;
    getAllScore();
}


/**
 *  首次加载
 * */
function getload() {
    var doctorId = getQueryString("doctorId");
    if (!doctorId) {
        window.history.go(-1);
        return false;
    }
    doctorInfo.doctorId = doctorId;
    this.getdoctorPageInfo();
}

/**
 *  关注 -  取消
 * */
function onclickFollower() {
    var isFollow = doctorInfo.isFollow;//true =关注中 false 没有关注
    if (isFollow) {
        //为true则取消关注
        var parments = {
            doctorId: doctorInfo.doctorId
        };
    }
    else {
        //为false则开始关注
        var parments = {
            doctorId: doctorInfo.doctorId
        };
        new postRequest({
            url: "/api/follow/save_relation.json",
            isShowLoader: true,
            param: parments,
            callBack(res) {
                if (res.code == 200) {
                    successMsg(res.message);
                    doctorInfo.isFollow = true;
                    $(".star-icon-w").html("已关注");
                    $(".star-icon-w").addClass("active");
                }
                else {
                    errorMsg(res.message);
                    return false;
                }
            }
        })
    }

}

/**
 *  在线问诊 点击事件
 * */
function getOnlineClick() {
    var ishaveLine = doctorInfo.doctorisonlineConsultation;
    if (ishaveLine == false) {
        console.log("no click");
        return false;
    }
    else {
        if (!doctorInfo.ishaveKey) {
            var url="/pages/diagnose/payment.html?doctorId="+doctorInfo.doctorId;
            loadSetTimeOut("请稍等",url);
            return false;
        }
        else {
            if (this.doctorInfo.onlinebtn == "WAIT_BUYER_PAY") {
                var url="/pages/users/inquiry.html";
                loadSetTimeOut("请稍等",url);
                return false;
            }
            else {
               
                var url="/pages/diagnose/ai_detail.html?recordId="+doctorInfo.recordId;
                loadSetTimeOut("请稍等",url);
            }
        }
    }
}

/**
 *  线下问诊按钮
 * */
function downClick() {
    if (doctorInfo.doctorisLinebelowdiagnosis == false) {
        errorMsg("该医生暂未开通线下面诊");
        return false;
    }
    var url = "/pages/diagnose/offline.html?doctorId=" + doctorInfo.doctorId;
    loadSetTimeOut("请稍等",url);
}

/**
 *  判断是否含有订单数据
 * */
function getifhaveOrder() {
    var parments = {
        doctorId: doctorInfo.doctorId
    };
    new getRequest({
        url: "/api/order/inquiry/get_going_inquiry.json",
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                if (res.hasOwnProperty("data")) {
                    doctorInfo.recordId = res.data.recordId;
                    doctorInfo.onlinebtn = res.data.status;
                    doctorInfo.ishaveKey = true;
                } else {
                    doctorInfo.recordId = '';
                    doctorInfo.onlinebtn = '';
                    doctorInfo.ishaveKey = false;
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
 *   擅长调理-查看更多
 * */
function shanchangMore(_this) {
    var toggle = doctorInfo.toggle;
    if (toggle) {
        $(_this).parent(".shanchang-list").find(".p-true").hide();
        $(_this).parent(".shanchang-list").find(".p-false").show();
        $(_this).text("收起更多");
        doctorInfo.toggle = !toggle;
    }
    else {
        $(_this).parent(".shanchang-list").find(".p-true").show();
        $(_this).parent(".shanchang-list").find(".p-false").hide();
        $(_this).text("查看更多");
        doctorInfo.toggle = !toggle;
    }
}

/**
 *  医生简介查看更多
 * */
function doctorDescMore() {
    var toggle = doctorInfo.moreText;
    if (toggle) {
        $(".choose-open").text("收起更多");
        $(".more-text").addClass("active");
    }
    else {
        $(".choose-open").text("查看更多");
        $(".more-text").removeClass("active");
    }
    doctorInfo.moreText = !toggle;
}

/**
 *  医生资质查询
 * */
function doctorQuery() {
    if(doctorInfo.imgList==null||doctorInfo.imgList.length==0)
    {
            errorMsg("该医生暂未上传资质证明");
            return false;
    }
    console.log(doctorInfo.imgList.join(","));
    $(".query-bg").show();
    $(".query-bg-info").show();
    DisabledScroll();
    
}

$(function(){
     $(".query-bg").click(function(){
        $(".query-bg").hide();
        $(".query-bg-info").hide();
        EabledScroll();
     });
})

/**
 *  跳转到新闻动态
 * */
function doctordynamic(_id) {
    var url = "/pages/home/news_detail.html?id=" + _id;
    loadSetTimeOut("请稍等", url);
}

/**
 *  医生动态-查看更多
 * */
function navUrlArticleMore() {
    var url = "/pages/home/doc_news.html?id=" + doctorInfo.doctorId;
    loadSetTimeOut("请稍等", url);
}


getload();
