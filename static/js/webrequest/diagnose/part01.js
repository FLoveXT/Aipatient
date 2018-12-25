/// <reference path="../all/services.js" />
//选择患者.js
var patients = {
    doctorId: '',//医生ID
    recordId: '',//记录ID
    choosepatient: {
        clickPatienValue: '选择患者',
        selectedPid: '',//选择的患者ID
        patientsList: [],//患者列表
        selectedSex: '',//选择患者的性别
        patientInfo: {
            isShow: false,
            height: '',
            weight: '',
            phone: '',
            address: '',
            history: '',
            remark: ''
        }
    },
    //主诉
    chiefComplaint: {
        content: '',
        maxLength: 25,
        minLength: 0,
    },
    //病史
    medicalHistory: {
        content: '',
        maxLength: 250,
        minLength: 0
    }

};


function Init() {

    var doctorId = getQueryString("doctorId");
    if (doctorId === null || doctorId === undefined || doctorId === "") {
        loadbackUrlTimeOut("医生ID传输错误");
        return false;
    }
    var recordId = getQueryString("recordId");
    if (recordId === null || recordId === undefined || recordId === "") {
        loadbackUrlTimeOut("记录ID传输错误");
        return false;
    }
    getWriteInfo(recordId,0,1);
    patients.doctorId = doctorId;
    patients.recordId = recordId;
    getPatientsList();

}



/**
 *  获取患者信息
 * */
function getPatientsList() {
    var api = "/api/patient/list.json";
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                patients.choosepatient.patientsList = res.data;
                console.log(patients.choosepatient.patientsList);
                $(".patients-list").html(template("patients-div", { list: patients.choosepatient }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  点击显示患者列表
 * */
function showList() {
    $(".user-show").show();
    $(".user-show").addClass("active");
    $(".user-info-detail").hide();
}

/**
 *  选择了患者需要关闭这个框，并去除active及给选择患者重新赋值
 * */
function clickPatienTab(_this) {
    var id = $(_this).attr("data-id");
    var name = $(_this).attr("data-name");
    _updateName = name;
    getpatientDetail(id);

}

/**
 *  获取患者详情
 * @param {any} _id
 * @param {any} name
 */
function getpatientDetail(_id) {
    var api = '/api/patient/' + _id;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                patients.choosepatient.patientInfo.address = data.address;
                patients.choosepatient.patientInfo.height = data.height;
                patients.choosepatient.patientInfo.phone = data.phoneNumber;
                patients.choosepatient.patientInfo.weight = data.weight;
                patients.choosepatient.patientInfo.history = data.medicalHistory == '' ? "无" : data.medicalHistory;
                patients.choosepatient.patientInfo.remark = data.remarks == '' ? "无" : data.remarks;
                patients.choosepatient.patientInfo.age = data.age;
                patients.choosepatient.patientInfo.sex = data.sex;
                patients.choosepatient.patientInfo.isShow = true;
                $(".user-show").hide();
                $(".user-show").removeClass("active");
                var newName = _updateName + " " + patients.choosepatient.patientInfo.sex + " " + patients.choosepatient.patientInfo.age;
                patients.choosepatient.selectedPid = _id;
                patients.choosepatient.selectedSex = data.sex;
                patients.choosepatient.clickPatienValue = newName;
                $(".patients-list").html(template("patients-div", { list: patients.choosepatient }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  新增患者
 * */
function addPatientsInfo() {
    var url = '/pages/diagnose/part02.html?actions=add&userId=&types=add_online_parint';
    layer.open({
        type: 2,
        title: false,
        closeBtn: 0, //不显示关闭按钮
        shade: [0],
        area: ['100%', '100%'],
        anim: 2,
        scrollbar: false,
        content: [url], //iframe的url，no代表不显示滚动条
    });
}
var _updateName = "";
function updatePatientInfo() {
    var url = '/pages/diagnose/part02.html?actions=edit&userId=' + patients.choosepatient.selectedPid + '&types=add_online_parint';
    layer.open({
        type: 2,
        title: false,
        closeBtn: 0, //不显示关闭按钮
        shade: [0],
        area: ['100%', '100%'],
        anim: 2, scrollbar: false,
        content: [url], //iframe的url，no代表不显示滚动条
    });
}

/**
 * part02 操作返回修改展示用户信息
 * */
function UpdatePatientInfo() {
    getpatientDetail(patients.choosepatient.selectedPid);
}



function clearArray() {
    choosepatient.patientInfo = {
        isShow: false,
        height: '',
        weight: '',
        phone: '',
        address: '',
        history: '',
        remark: '',
    }
}

/**
 *  主诉和病史字符串监控
 * */
function checkStrchiefComplaint(that, types) {
    var length = $(that).val().length;
    var valueMin = length;
    if (types == 1) {
        $(".zev-min-zs").html(valueMin);
        patients.chiefComplaint.content = $(that).val();
    }
    else {
        $(".zev-min-bs").html(valueMin);
        patients.medicalHistory.content = $(that).val();
    }
}

/**
 *  上传 舌苔和舍底照片
 * */
function uploadFirst(_this, _index, _fileId) {
    new imageFileupload({
        id: _fileId,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                if (_index == 1) {
                    $("#uploadFirst1_2").hide();
                    $("#uploadFirst1_1").show();
                    $("#uploadFirst1_1 .c-img").attr("src", res.data.url);
                }
                else if (_index == 2) {
                    $("#uploadFirst2_2").hide();
                    $("#uploadFirst2_1").show();
                    $("#uploadFirst2_1 .c-img").attr("src", res.data.url);
                }
                else if (_index == 3) {
                    $("#uploadFirst3_2").hide();
                    $("#uploadFirst3_1").show();
                    $("#uploadFirst3_1 .c-img").attr("src", res.data.url);
                }
            } else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  上传 患处照片-检查报告-化验单
 * */
function uploadLast(_this, _index, _fileId) {
    new imageFileupload({
        id: _fileId,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                if (_index == 1) {
                    $("#uploadLast1_2").hide();
                    $("#uploadLast1_1").show();
                    $("#uploadLast1_1 .c-img").attr("src", res.data.url);
                }
                else if (_index == 2) {
                    $("#uploadLast2_2").hide();
                    $("#uploadLast2_1").show();
                    $("#uploadLast2_1 .c-img").attr("src", res.data.url);
                }
                else if (_index == 3) {
                    $("#uploadLast3_2").hide();
                    $("#uploadLast3_1").show();
                    $("#uploadLast3_1 .c-img").attr("src", res.data.url);
                }
            } else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  清除图集
 * @param {any} _this  本身
 * @param {any} _index 索引
 * @param {any} _hideDiv 需要隐藏的Div
 * @param {any} _showDiv 需要显示的DIV
 */
function closeClearImages(_this, _index, _hideDiv, _showDiv) {
    $("#" + _showDiv).show();
    $("#" + _hideDiv).hide();
    $("#" + _hideDiv).find(".c-img").attr("src", "");
}

function chiefcomplaintBtnChange() {
    $(".exp-pop02").show();
    $(".exp-pop02 .bg").show();
}
function uploadPhotoDemoBtnChange() {
    $(".exp-pop01").show();
    $(".exp-pop01 .bg").show();
}
function hideExpPop(_this) {
    $(_this).parents(".exp-pop").hide();
    $(_this).hide();
}

/**
 *  开始提交
 *  */
function commmitInfo() {
    if (patients.doctorId == "") {
        errorMsg("医生资料错误");
        return false;
    }
    if (patients.recordId == "") {
        errorMsg("订单信息错误");
        return false;
    }
    if (patients.choosepatient.selectedPid == "") {
        errorMsg("请选择一名患者");
        return false;
    }
    if (patients.chiefComplaint.content == "") {
        errorMsg("请输入主诉内容");
        return false;
    }
    if (patients.medicalHistory.content == "") {
        errorMsg("请输入现病史症状内容");
        return false;
    }
    var shetaiArray = [];
    $(".shetai-list .c-img").each(function () {
        if ($(this).attr("src") != "") {
            shetaiArray.push($(this).attr("src"));
        }
    });
    var binghuanArray = [];
    $(".binghuan-list .c-img").each(function () {
        if ($(this).attr("src") != "") {
            binghuanArray.push($(this).attr("src"));
        }
    });
    if (shetaiArray.length == 0) {
        errorMsg("请上传舌苔舌底图");
        return false;
    }
    if (binghuanArray.length == 0) {
        errorMsg("请上传病患处照片");
        return false;
    }
    var parments = {
        "doctorId": patients.doctorId,
        "recordId": patients.recordId,
        "patientId": patients.choosepatient.selectedPid,
        "appeal": patients.chiefComplaint.content, //主诉内容
        "symptom": patients.medicalHistory.content, //现病史内容
        "tongueImages": shetaiArray,
        "otherImages": binghuanArray,
    };
    var json = JSON.stringify(parments);
    var api = '/api/interrogation/save_one_step.json';
    new postJsonRequest({
        url: api,
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                selecttemplate(patients.recordId);
                successMsg(res.message);
                return false;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  获取模板资料
 * */
function selecttemplate(optionsId) {
    var api = '/api/interrogation/judge_patient.json';
    var parments = {
        recordId: optionsId
    };
    new getRequest({
        url: api,
        isShowLoader: true,
        param: parments,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                var sex = data.sex == "M" ? "男" : "女";
                var template = data.template;
                var url = "";
                if (template == "儿童") {
                    url = "/pages/diagnose/child_step01.html?sex=" + sex + "&recordId=" + optionsId
                }
                else {
                   url = '/pages/diagnose/step01.html?recordId=' + optionsId
                }
                loadSetTimeOut("请稍等", url);
                return false;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

Init();