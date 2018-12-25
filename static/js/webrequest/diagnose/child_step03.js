var child03 = {
      recordId: '',//记录ID
    isLast: '',//是否是上一页回来
    //大便次数
    Stool: [
        {
            isChecked: false,
            name: "大便一天一次"
        },
        {
            isChecked: false,
            name: "大便一天几次"
        },
        {
            isChecked: false,
            name: "大便几天一次"
        },
    ],
    shape: [
        {
            isChecked: false,
            name: "成形、不干不稀（香蕉便）"
        },
        {
            isChecked: false,
            name: "成形、偏干"
        },
        {
            isChecked: false,
            name: "成形、偏软（细条状）"
        },
        {
            isChecked: false,
            name: "干燥成球状"
        },
    ],
    stoolColor: [
        {
            isChecked: false,
            name: "大便黄"
        },
        {
            isChecked: false,
            name: "大便黑（吃了黑色食物不算）"
        },
        {
            isChecked: false,
            name: "大便白"
        },
        {
            isChecked: false,
            name: "大便青"
        },
        {
            isChecked: false,
            name: "便血（吃了红色食物不算）"
        }
    ],
    Urination: [
        {
            isChecked: false,
            name: "小便次数偏多（多于8次）"
        },
        {
            isChecked: false,
            name: "小便次数偏少（少于5次）"
        },
        {
            isChecked: false,
            name: "正常"
        },
    ],
    peeColor: [
        {
            isChecked: false,
            name: "小便深黄"
        },
        {
            isChecked: false,
            name: "小便淡黄"
        },
        {
            isChecked: false,
            name: "小便红"
        },
        {
            isChecked: false,
            name: "小便无色"
        },
    ],

};

/**
 *   大便次数
 * */
function rebiancishuOnclick(_this, _index) {
    for (var i in child03.Stool) {
        if (i == _index) {
            child03.Stool[i].isChecked = true;
        } else {
            child03.Stool[i].isChecked = false;
        }
    }
    console.log(child03.Stool);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   形状质地
 * */
function xingzhuangzhidiOnclick(_this, _index) {
    var isCheck = false;
    if ($(_this).hasClass("active")) {
        isCheck = false;
        $(_this).removeClass("active");
    }
    else {
        isCheck = true;
        $(_this).addClass("active");
    }
    var active = child03.shape;
    active[_index].isChecked = isCheck;
    console.log(active);
}

/**
 *   大便颜色
 * */
function dabianyanseOnclick(_this, _index) {
    for (var i in child03.stoolColor) {
        if (i == _index) {
            child03.stoolColor[i].isChecked = true;
        } else {
            child03.stoolColor[i].isChecked = false;
        }
    }
    console.log(child03.stoolColor);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   小便次数
 * */
function xiaobiancishuOnclick(_this, _index) {
    for (var i in child03.Urination) {
        if (i == _index) {
            child03.Urination[i].isChecked = true;
        } else {
            child03.Urination[i].isChecked = false;
        }
    }
    console.log(child03.Urination);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   小便颜色
 * */
function xiaobianOnclick(_this, _index) {
    for (var i in child03.peeColor) {
        if (i == _index) {
            child03.peeColor[i].isChecked = true;
        } else {
            child03.peeColor[i].isChecked = false;
        }
    }
    console.log(child03.peeColor);
    $(_this).addClass("active").siblings().removeClass("active");
}

function Init() {
    var recordId = getQueryString("recordId");
    if (recordId == undefined || recordId == "" || recordId == null) {
        window.location.href = "/";
        return false;
    }
    child03.recordId = recordId;
    var islast = getQueryString("islast");
    getWriteInfo(recordId, islast, 3);
    if (islast == "1") {
        getdetailInfo();
    }
    else {
        showLoaders();
        setTimeout(function () {
            hideLoaders();
            $(".child03").html(template('child03-div', { list: child03 }));
        }, 500);
    }
}

/**
 *   字符串补充说明
 * */
function valueStrCheck(that) {
    var length = $(that).val().length;
    var valueMin = length;
    $(".zev-min").html(valueMin);
}

Init();

/**
 *  提交
 * */
function commitInfo() {
    var array = {
        "stoolTime": child03.Stool.find(t => t.isChecked == true) ? child03.Stool.find(t => t.isChecked == true).name : "",
        "shape": Enumerable.From(child03.shape).Where(t => t.isChecked == true).Select(t => t.name).ToArray(),
        "colour": child03.stoolColor.find(t => t.isChecked == true) ? child03.stoolColor.find(t => t.isChecked == true).name : "",
        "urineTime": child03.Urination.find(t => t.isChecked == true) ? child03.Urination.find(t => t.isChecked == true).name : "",
        "urineColour": child03.peeColor.find(t => t.isChecked == true) ? child03.peeColor.find(t => t.isChecked == true).name : "",
        "supplement": $(".content-value").val()
    };
    var api = '/api/interrogation/save_template.json';
    var parments = {
        recordId: child03.recordId,
        templateType: 'childExcrement',
        childExcrement: array,
        "complete": true
    };
    var json = JSON.stringify(parments);
    console.log(parments);
    new putJsonRequest({
        url: api,
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                var url = "/pages/diagnose/ai_detail.html?recordId=" + child03.recordId;
                successSetTimeOut("请稍等,正在发送给医生", url);
                return false;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })

}
