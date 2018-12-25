//编辑患者信息.js
var options = {
    action: '',//默认添加
    userId: '',//用户ID
    types: '',//必填参数,区别线下面诊和在线问诊
    info: {
        name: '',
        sex: '',
        birthday: '',
        height: '',
        weight: '',
        phone: '',
        area: '',
        remark: '',
        medicalhistory: '',
        medicalhistoryInfo: [
            {
                isCheck: false,
                name: "高血压"
            },
            {
                isCheck: false,
                name: "高血脂"
            },
            {
                isCheck: false,
                name: "高血糖"
            },
            {
                isCheck: false,
                name: "心脏病"
            },
            {
                isCheck: false,
                name: "脑淤血"
            },
            {
                isCheck: false,
                name: "脑梗"
            },
            {
                isCheck: false,
                name: "肝病"
            },
            {
                isCheck: false,
                name: "无"
            },],
        remarkMax: 250,
        remarkMin: 0,
    },
    //返回的数组
    returnArray: {

    }
};


function Init() {
    $(".footer-info").remove();

    var actions = getQueryString("actions");
    var userId = getQueryString("userId");
    var types = getQueryString("types");

    actions = actions == undefined || actions == '' || actions == "add" ? "add" : "edit";
    userId = userId == undefined || userId == '' ? "" : userId;
    types = types == undefined || types == '' ? "" : types;
    options.action = actions;
    options.types = types;
    options.userId = userId;
    if (actions == "edit") {
        getpatientsInfo(userId);
    }
    else {
        showLoaders();
        setTimeout(function () {
            $(".body-view").html(template('body-div', { item: options.info }));
            hideLoaders();
        }, 500);

    }
}

/**
 *  获取患者信息详情
 * */
function getpatientsInfo(_userId) {
    var api = "/api/patient/" + _userId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                if (data.medicalHistory != '') {
                    var medicaArray = data.medicalHistory.split(',');
                    var array = [{
                        isCheck: false,
                        name: "高血压"
                    },
                    {
                        isCheck: false,
                        name: "高血脂"
                    },
                    {
                        isCheck: false,
                        name: "高血糖"
                    },
                    {
                        isCheck: false,
                        name: "心脏病"
                    },
                    {
                        isCheck: false,
                        name: "脑淤血"
                    },
                    {
                        isCheck: false,
                        name: "脑梗"
                    },
                    {
                        isCheck: false,
                        name: "肝病"
                    },
                    {
                        isCheck: false,
                        name: "无"
                    }];
                    for (var i in array) {
                        for (var y in medicaArray) {
                            if (medicaArray[y].indexOf(array[i].name) > -1) {
                                array[i].isCheck = true;
                            }
                        }               
                    }
                    options.info = {
                        name: data.name,
                        sex: data.sex,
                        birthday: data.birthday,
                        height: data.height,
                        weight: data.weight,
                        phone: data.phoneNumber,
                        area: data.address,
                        remark: data.remarks,
                        medicalhistoryInfo: array,
                        remarkMax:250
                    }
                    if (options.info.remark != '') {
                        var length = options.info.remark.length;
                        options.info.remarkMin = length;
                    }
                    console.log(array);
                }
                $(".body-view").html(template('body-div', { item: options.info }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}


/**
        *   ActionSheet-男女选择
        * */
function actionsheetOpen() {
    var $as = $('.m-actionsheet');
    $(".sex-api").click(function () {
        $as.actionSheet('open');
    });
}

/**
 *   获取男女性别点击获取
 * */
function actionSheetClick(_sex) {
    $(".req-sex").val(_sex == "M" ? "男" : _sex == "F" ? "女" : "");
    $(".req-sex").attr("data-value", _sex);
    var $as = $('.m-actionsheet');
    $as.actionSheet('close');
}

/**
 *   ActionSheet-男女关闭
 * */
function actionsheetClose() {
    var $as = $('.m-actionsheet');
    $as.actionSheet('close');
}

var r = false;
function openDate() {
    if (!r) {
        var now = new Date();
        var yearn = now.getFullYear();
        console.log(yearn);
        new rolldate.Date({
            el: '#date10',
            format: 'YYYY-MM-DD',
            beginYear: 1900,
            endYear: yearn,
            endMonth: 08,
            theme: 'blue',
            tapBefore: function (el) {
                console.log('插件开始触发');
            },
            moveEnd: function (el, iscroll) {
                console.log('滚动结束');
            },
            confirmBefore: function (el, date) {
                var d = new Date(),
                    d1 = new Date(date.replace(/\-/g, "\/")),
                    d2 = new Date(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate());

                if (d1 > d2) {
                    errorMsg('不能大于当前的日期');
                    return false;
                }
            },
            confirmEnd: function (el, date) {
                console.log('插件运行结束');
            }
        })
        r = true;
    }
}


window.onload = function () {
    setTimeout(function () {
        openDate();
    }, 1000);
    Init();
}

/**
 *  地址库选择
 *  使用京东地址库
 * */
function chooseArea() {
    var $target = $('#AddressAreaInput');
    $target.citySelect();
    $target.on('click', function (event) {
        event.stopPropagation();
        $target.citySelect('open');
    });
    $target.on('done.ydui.cityselect', function (ret) {
        $(this).val(ret.provance + ',' + ret.city + ',' + ret.area);
    });
}

/**
 *  是否存在既往病史选择
 * */
function medicalhistoryClick(_this, _index) {
    var isCheck = false;
    if ($(_this).hasClass("active")) {
        isCheck = false;
        $(_this).removeClass("active");
    }
    else {
        isCheck = true;
        $(_this).addClass("active");
    }
    var optionsHistory = options.info.medicalhistoryInfo;
    optionsHistory[_index].isCheck = isCheck;
    console.log(optionsHistory);
}

/**
 *  检测字符
 *  */
function checkStrInfo(that) {
    var length = $(that).val().length;
    var valueMin = length;
    $(".zev-min").html(valueMin);
}

/**
 *  提交
 * */
function CommintInfo(_this) {
    var action = options.action;
    var parments = {
        name: $(".req-name").val(),
        sex: $(".req-sex").attr("data-value"),
        birthday: $(".req-birthday").val(),
        height: $(".req-height").val(),
        weight: $(".req-weight").val(),
        phoneNumber: $(".req-phoneNumber").val(),
        address: $(".req-address").val(),
        medicalHistory: getHistory().join(','),
        remarks: $(".req-textarea").val()
    };

    if (parments.name == '') {
        errorMsg("姓名为必填项,请填写");
        return false;
    }
    if (parments.sex == '') {
        errorMsg("性别为必选项,请选择");
        return false;
    }
    if (parments.birthday == '') {
        errorMsg("生日为必选项,请选择");
        return false;
    }
    if (parments.phoneNumber == '') {
        errorMsg("手机为必填项,请填写");
        return false;
    }
    if (parments.address == '') {
        errorMsg("地区为必选项,请选择");
        return false;
    }
    if (parments.medicalHistory == '') {
        errorMsg("请最少选择一个病史或选择无");
        return false;
    }

    if (action == "add") {
        var api = "/api/patient/save.json";
        var json = JSON.stringify(parments);
        new postJsonRequest({
            url: api,
            isShowLoader: true,
            param: json,
            callBack(res) {
                if (res.code == 200) {
                    //购买线下问诊
                    if (options.types == "buy_line_services") {
                        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                        parent.GetParientsInfo();
                        parent.layer.close(index);
                        return false;
                    }
                    //购买在线问诊
                    else if (options.types == "add_online_parint") {
                        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                        parent.getPatientsList();
                        parent.layer.close(index);
                        return false;
                    }
                    return false;
                }
                else {
                    errorMsg(res.message);
                    return false;
                }
            }
        })
    }
    else {
        var api = "/api/patient/update/" + options.userId;
        var json = JSON.stringify(parments);
        new putJsonRequest({
            url: api,
            isShowLoader: true,
            param: json,
            callBack(res) {
                if (res.code == 200) {
                    //购买线下问诊
                    if (options.types == "buy_line_services") {

                    }
                    //购买在线问诊
                    else if (options.types == "add_online_parint") {
                        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                        parent.getPatientsList();
                        //parent.choosepatient.patientInfo = {
                        //    isShow: true,
                        //    height: parments.height,
                        //    weight: parments.weight,
                        //    phone: parments.phoneNumber,
                        //    address: parments.address,
                        //    history: parments.medicalHistory.join(','),
                        //    remark: parments.remarks
                        //}
                        parent._updateName = parments.name;
                        parent.UpdatePatientInfo();
                        parent.patients.choosepatient.patientInfo = {
                            isShow: false,
                            height:'',
                            weight:'',
                            phone: '',
                            address: '',
                            history: '',
                            remark: '',
                        }
                        parent.layer.close(index);
                        return false;
                    }
                    return false;
                }
                else {
                    errorMsg(res.message);
                    return false;
                }
            }
        })
    }
}

function getHistory() {
    var array = [];
    $(".cont-active-list text").each(function () {
        if ($(this).hasClass("active")) {
            array.push($(this).text());
        }
    });
    return array;
}