var adult02 = {
    recordId: '',
    isLast: '',
    stool: [{
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
    {
        isChecked: false,
        name: "长期便秘"
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
        {
            isChecked: false,
            name: "不成形、偏烂"
        },
        {
            isChecked: false,
            name: "黏马桶"
        },
        {
            isChecked: false,
            name: "腹泻"
        },
    ],

    colour: [
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
        },
    ]
    , other: [
        {
            isChecked: false,
            name: "放屁多"
        },
        {
            isChecked: false,
            name: "放屁臭"
        },
        {
            isChecked: false,
            name: "大便臭"
        },
        {
            isChecked: false,
            name: "大便时灼热感"
        },
        {
            isChecked: false,
            name: "想拉拉不出"
        },
        {
            isChecked: false,
            name: "无以上情况"
        },
    ],
    urine: [
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
            name: "夜尿超过一次（睡前喝多了水不算）"
        },
        {
            isChecked: false,
            name: "尿急"
        },
        {
            isChecked: false,
            name: "遗尿"
        },
        {
            isChecked: false,
            name: "尿不尽"
        },
        {
            isChecked: false,
            name: "小便时涩痛感"
        },
        {
            isChecked: false,
            name: "尿热烫"
        },
        {
            isChecked: false,
            name: "尿血"
        },
        {
            isChecked: false,
            name: "小便味道大"
        },
        {
            isChecked: false,
            name: "小便泡沫多"
        },
        {
            isChecked: false,
            name: "无以上情况"
        },
    ]
}


function Init() {
    var recordId = getQueryString("recordId");
    if (recordId == undefined || recordId == "" || recordId == null) {
        window.location.href = "/";
        return false;
    }
    adult02.recordId = recordId;
    var islast = getQueryString("islast");
    getWriteInfo(recordId, islast, 2);
    if (islast == "1") {
        getdetailInfo();
    }
    else {
        showLoaders();
        setTimeout(function () {
            hideLoaders();
            $(".adult02").html(template('adult02-div', { list: adult02 }));
        }, 500);
    }
}

/**
 *  获取详情赋值
 * */
function getdetailInfo() {
    var api = '/api/interrogation/' + adult02.recordId
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                var diet = data.excrement
                if (diet != null) {
                    var stool = diet.stool;
                    var shape = diet.shape;
                    var colour = diet.colour;
                    var other = diet.other;
                    var urine = diet.urine;
                    var supplement = diet.supplement;
                    for (var i in adult02.stool) {
                        if (adult02.stool[i].name == stool) {
                            adult02.stool[i].isChecked = true;
                        }
                    }

                    for (var i in adult02.shape) {
                        if (shape == null || shape == null) {
                            continue;
                        }
                        if (shape.indexOf(adult02.shape[i].name) > -1) {
                            adult02.shape[i].isChecked = true;
                        }
                    }

                    for (var i in adult02.colour) {
                        if (adult02.colour[i].name == colour) {
                            adult02.colour[i].isChecked = true;
                        }
                    }
                    for (var i in adult02.other) {
                        if (other == null || other == null) {
                            continue;
                        }
                        if (other.indexOf(adult02.other[i].name) > -1) {
                            adult02.other[i].isChecked = true;
                        }
                    }

                    for (var i in adult02.urine) {
                        if (urine == null || urine == null) {
                            continue;
                        }
                        if (urine.indexOf(adult02.urine[i].name) > -1) {
                            adult02.urine[i].isChecked = true;
                        }
                    }

                    var content = supplement;
                    contentWrite(content);
                    showLoaders();
                    setTimeout(function () {
                        hideLoaders();
                        $(".adult02").html(template('adult02-div', { list: adult02 }));
                    }, 500);
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
 *  内容写入
 * */
function contentWrite(data) {
    $(".content-value").val(data);
    var datalength = data.length;
    $(".zev-min").html(datalength);
}


/**
 *  大便点击事件
 * @param {any} _this
 * @param {any} _index
 */
function dabianOnclick(_this, _index) {
    for (var i in adult02.stool) {
        if (i == _index) {
            adult02.stool[i].isChecked = true;
        } else {
            adult02.stool[i].isChecked = false;
        }
    }
    console.log(adult02.stool);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   形状质地
 * */
function xingzhuangClick(_this, _index) {
    var isCheck = false;
    if ($(_this).hasClass("active")) {
        isCheck = false;
        $(_this).removeClass("active");
    }
    else {
        isCheck = true;
        $(_this).addClass("active");
    }
    var active = adult02.shape;
    active[_index].isChecked = isCheck;
    console.log(active);
}

/**
 *  大便颜色点击事件
 * @param {any} _this
 * @param {any} _index
 */
function dabianyanseOnclick(_this, _index) {
    for (var i in adult02.colour) {
        if (i == _index) {
            adult02.colour[i].isChecked = true;
        } else {
            adult02.colour[i].isChecked = false;
        }
    }
    console.log(adult02.colour);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   其他
 * */
function otherClick(_this, _index) {
    var isCheck = false;
    if ($(_this).hasClass("active")) {
        isCheck = false;
        $(_this).removeClass("active");
    }
    else {
        isCheck = true;
        $(_this).addClass("active");
    }
    var active = adult02.other;
    active[_index].isChecked = isCheck;
    console.log(active);
}

/**
 *   小便
 * */
function xiaobianClick(_this, _index) {
    var isCheck = false;
    if ($(_this).hasClass("active")) {
        isCheck = false;
        $(_this).removeClass("active");
    }
    else {
        isCheck = true;
        $(_this).addClass("active");
    }
    var active = adult02.urine;
    active[_index].isChecked = isCheck;
    console.log(active);
}


/**
 *  提交
 * */
function commitInfo() {
    var array = {
        "stool": adult02.stool.find(t => t.isChecked == true) ? adult02.stool.find(t => t.isChecked == true).name : "",
        "shape": Enumerable.From(adult02.shape).Where(t => t.isChecked == true).Select(t => t.name).ToArray(),
        "colour": adult02.colour.find(t => t.isChecked == true) ? adult02.colour.find(t => t.isChecked == true).name : "",
        "other": Enumerable.From(adult02.other).Where(t => t.isChecked == true).Select(t => t.name).ToArray(),
        "urine": Enumerable.From(adult02.urine).Where(t => t.isChecked == true).Select(t => t.name).ToArray(),
        "supplement": $(".content-value").val()
    };
    var api = '/api/interrogation/save_template.json';
    var parments = {
        recordId: adult02.recordId,
        templateType: 'excrement',
        excrement: array
    };
    var json = JSON.stringify(parments);
    new putJsonRequest({
        url: api,
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                var url = "/pages/diagnose/step03.html?recordId=" + adult02.recordId;
                successSetTimeOut("第二步保存成功", url);
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
 *   字符串补充说明
 * */
function valueStrCheck(that) {
    var length = $(that).val().length;
    var valueMin = length;
    $(".zev-min").html(valueMin);
}

Init();