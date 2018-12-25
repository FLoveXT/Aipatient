var doctor = {
    inputSearch: '',
    sortType: 'complex',
    pageIndex: 1,
    pageSize: 10,
    searchName: '',
    disabled: false,
    name: '',
    more: '',
    searchId: '',
    type: '',
    pageList: [],
    searchList:[],
};

$(function () {
    Init();
})

/**
 *  初始化
 * */
function Init() {
    var more = getQueryString("more");
    if (more) {
        doctor.more = more;
    }
    var name = getQueryString("name");
    if (name) {
        doctor.name = name;
        var can = doctor.more ? "治疗" : "";
        var title = "以下医生擅长" + can + "【" + name + "】";
        $(".title-info").html(title);
        $(".title-info").show();
        $(".search-tit").text(name);
    }
    var id = getQueryString("id");
    if (id) {
        doctor.searchId = id;
    }
    var types = getQueryString("types");
    if (!types) {
        errorSetTimeOut("请求参数错误", "/");
        return false;
    }
    var arrayTypes = ["disease", "keshi"];
    if (arrayTypes.indexOf(types) <=-1) {
        errorSetTimeOut("请求参数错误", "/");
        return false;
    }
    doctor.type = types;
    if (types == "disease") {
        getDiseaseList();
        getdiseaseIddoctorList();
    }
    else {
        getDepartList();
        getdepartdoctorList();
    }
}



/**
 *  获取疾病列表
 * */
function getDiseaseList() {
    new getRequest({
        url: "/api/common/list_disease.json",
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var array = [];
                for (var i = 0; i < res.data.length; i++) {
                    array.push({
                        "id": res.data[i].diseaseId,
                        "name": res.data[i].diseaseName,
                    });
                }
                doctor.searchList = array;
                $("#gradew").html(template('search-div', { list: doctor.searchList }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  获取科室列表
 * */
function getDepartList() {
    new getRequest({
        url: "/api/common/list_depart.json",
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var array = [];
                for (var i = 0; i < res.data.length; i++) {
                    array.push({
                        "id": res.data[i].departId,
                        "name": res.data[i].departName,
                    });
                }
                doctor.searchList = array;
                $("#gradew").html(template('search-div', { list: doctor.searchList }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}


var isOpen = false;
/**
 *  点击筛选
 * */
function searchInfo() {
    if (!isOpen) {
        DisabledScroll();
        isOpen = true;
        $(".grade-eject").show("snow");
        $(".grade-eject-bg").show();
    }
    else {
        EabledScroll();
        isOpen = false;
        $(".grade-eject").hide("snow");
        $(".grade-eject-bg").hide("snow");
    }
}

/**
 *  点击搜索
 * */
function searchClick(_this,_id) {
    var name = $(_this).attr("data-name");
    $(".search-tit").text(name);
    isOpen = true;
    searchInfo();
    doctor.searchId = _id;
    doctor.pageSize = 10;
    doctor.pageIndex = 1;
    doctor.pageList = [];
    if (doctor.type == "disease") {
        //疾病
        getdiseaseIddoctorList();
    }
    else {
        getdepartdoctorList();
    }
    var can = doctor.more ? "治疗" : "";
    var title = "以下医生擅长" + can + "【" + name + "】";
    $(".title-info").html(title);
    $(".title-info").show();
}

function getdiseaseIddoctorList() {
    var parmets = {
        pageNum: doctor.pageIndex,
        pageSize: doctor.pageSize,
        sortType: doctor.sortType,
        diseaseId: doctor.searchId,
        searchWord: doctor.searchName
    };

    new getRequest({
        url: "/api/doctor/list_disease.json",
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                doctor.pageList = doctor.pageList.concat(data)
                doctor.disabled = res.page.pageCount > doctor.pageIndex ? true : false;
                $(".doctor-list").html(template('doctor-div', { list: doctor.pageList }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function getdepartdoctorList() {
    var parmets = {
        pageNum: doctor.pageIndex,
        pageSize: doctor.pageSize,
        sortType: doctor.sortType,
        departId: doctor.searchId,
        searchWord: doctor.searchName
    };
    console.log(parmets);
    new getRequest({
        url: "/api/doctor/list_depart.json",
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                doctor.pageList = doctor.pageList.concat(data)
                doctor.disabled = res.page.pageCount > doctor.pageIndex ? true : false;
                $(".doctor-list").html(template('doctor-div', { list: doctor.pageList }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  搜索
 * */
function searchWordChange() {
    var value = $("#txtInput").val();
    doctor.pageIndex = 1;
    doctor.pageList = [];
    doctor.searchName = value;
    if (doctor.type == "disease") {
        //疾病
        getdiseaseIddoctorList();
    }
    else {
        getdepartdoctorList();
    }
}

function goPage(_id) {
    var url = "/pages/home/doc_page.html?doctorId=" + _id;
    loadSetTimeOut("请稍等",url);
}

/**
 *  综合排序
 * */
function ComprehensiveSort() {
    doctor.sortType = "complex";
    doctor.pageIndex = 1;
    doctor.pageList = [];
    if (doctor.type == "disease") {
        //疾病
        getdiseaseIddoctorList();
    }
    else {
        getdepartdoctorList();
    }
}

/**
 *  评分排序
 * */
function  ScoreSort() {
    doctor.sortType = "appraise";
    doctor.pageIndex = 1;
    doctor.pageList = [];
    if (doctor.type == "disease") {
        //疾病
        getdiseaseIddoctorList();
    }
    else {
        getdepartdoctorList();
    }
}


$(window).scroll(function () {
    if ($(document).scrollTop() + $(window).height() >= $(document).height() - 50) {

        if (!doctor.disabled) {
            return false;
        }
        doctor.pageIndex = (doctor.pageIndex) + 1;
       
        if (doctor.type == "disease") {
            //疾病
            getdiseaseIddoctorList();
        }
        else {
            getdepartdoctorList();
        }
        console.log(doctor.pageIndex);
    }
});