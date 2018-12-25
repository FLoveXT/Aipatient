
//儿童模板-第一步-填写问诊单.js
var child01 = {
    recordId: '',//记录ID
    isLast: '',//是否是上一页回来
    //体温
    bodyTemperature: [
        {
            isChecked: false,
            name: "发冷"
        },
        {
            isChecked: false,
            name: "发热（39℃以下）"
        },
        {
            isChecked: false,
            name: "高热（39℃以上）"
        },
        {
            isChecked: false,
            name: "正常"
        },
    ],
    //手脚
    handsFeet: [
        {
            isChecked: false,
            name: "手脚发冷"
        },
        {
            isChecked: false,
            name: "手脚发热"
        },
        {
            isChecked: false,
            name: "正常"
        }
    ],
    //咳嗽
    cough: [
        {
            isChecked: false,
            name: "有咳嗽"
        },
        {
            isChecked: false,
            name: "无"
        }
    ],
    //痰
    sputum: [
        {
            isChecked: false,
            name: "黄痰"
        },
        {
            isChecked: false,
            name: "黄白痰"
        },
        {
            isChecked: false,
            name: "白痰粘稠"
        },
        {
            isChecked: false,
            name: "白痰清稀"
        },
        {
            isChecked: false,
            name: "清稀泡沫痰"
        },
        {
            isChecked: false,
            name: "痰中带血丝"
        },
        {
            isChecked: false,
            name: "无痰"
        }
    ],
    //说明
    Description: {
        maxLength: 250,
        minLength: 0,
        content: ''
    }

};


function Init() {
    var recordId = getQueryString("recordId");
    if (recordId == undefined || recordId == "" || recordId == null) {
        window.location.href = "/";
        return false;
    }
    child01.recordId = recordId;
    var islast = getQueryString("islast");
    getWriteInfo(recordId, islast, 1);
    if (islast == "1") {
        getdetailInfo();
    }
    else {
        showLoaders();
        setTimeout(function () {
            hideLoaders();
            $(".child01").html(template('child01-div', { list: child01 }));
        }, 500);
    }
}

/**
 *  获取详情赋值
 * */
function getdetailInfo() {
    var api = '/api/interrogation/' + child01.recordId
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                var special = data.special;
                if (special != null) {
                    var temperature = special.temperature;
                    var foot = special.foot;
                    var cough = special.cough;
                    var supplement = special.supplement;
                    var sputum = special.sputum;
                    for (var i in child01.bodyTemperature) {
                        if (child01.bodyTemperature[i].name == temperature) {
                            child01.bodyTemperature[i].isChecked = true;
                        }
                    }

                    for (var i in child01.handsFeet) {
                        if (child01.handsFeet[i].name == foot) {
                            child01.handsFeet[i].isChecked = true;
                        }
                    }

                    for (var i in child01.cough) {
                        if (child01.cough[i].name == cough) {
                            child01.cough[i].isChecked = true;
                        }
                    }

                    for (var i in child01.sputum) {
                        if (sputum == null || sputum == null) {
                            continue;
                        }
                        if (sputum.indexOf(child01.sputum[i].name) > -1) {
                            child01.sputum[i].isChecked = true;
                        }
                    }

                    child01.Description = supplement;
                    console.log(child01);

                    showLoaders();
                    setTimeout(function () {
                        hideLoaders();
                        $(".child01").html(template('child01-div', { list: child01 }));
                    }, 500);
                    contentWrite(child01.Description);
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
 *  体温点击事件
 * @param {any} _this
 * @param {any} _index
 */
function tiwenOnclick(_this, _index) {
    for (var i in child01.bodyTemperature) {
        if (i == _index) {
            child01.bodyTemperature[i].isChecked = true;
        } else {
            child01.bodyTemperature[i].isChecked = false;
        }
    }
    console.log(child01.bodyTemperature);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *  手脚点击事件
 * */
function shoujiaoOnClick(_this, _index) {
    for (var i in child01.handsFeet) {
        if (i == _index) {
            child01.handsFeet[i].isChecked = true;
        } else {
            child01.handsFeet[i].isChecked = false;
        }
    }
    console.log(child01.handsFeet);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *  手脚点击事件
 * */
function keSouOnClick(_this, _index) {
    for (var i in child01.cough) {
        if (i == _index) {
            child01.cough[i].isChecked = true;
        } else {
            child01.cough[i].isChecked = false;
        }
    }
    console.log(child01.cough);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *  痰-多选项
 * */
function TanOnClick(_this, _index) {
    var isCheck = false;
    if ($(_this).hasClass("active")) {
        isCheck = false;
        $(_this).removeClass("active");
    }
    else {
        isCheck = true;
        $(_this).addClass("active");
    }
    var sputum = child01.sputum;
    sputum[_index].isChecked = isCheck;
    console.log(sputum);
}

/**
 *   字符串补充说明
 * */
function valueStrCheck(that) {
    var length = $(that).val().length;
    var valueMin = length;
    $(".zev-min").html(valueMin);
}

/**
 *  提交
 * */
function commitInfo() {
    var array = {
        "temperature": child01.bodyTemperature.find(t => t.isChecked == true) ? child01.bodyTemperature.find(t => t.isChecked == true).name : "",
        "foot": child01.handsFeet.find(t => t.isChecked == true) ? child01.handsFeet.find(t => t.isChecked == true).name : "",
        "cough": child01.cough.find(t => t.isChecked == true) ? child01.cough.find(t => t.isChecked == true).name : "",
        "sputum": Enumerable.From(child01.sputum).Where(t => t.isChecked == true).Select(t => t.name).ToArray(),
        "supplement": $(".content-value").val()
    };
    var api = '/api/interrogation/save_template.json';
    var parments = {
        recordId: child01.recordId,
        templateType: 'special',
        special: array
    };
    var json = JSON.stringify(parments);
    new putJsonRequest({
        url: api,
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                var url = "/pages/diagnose/child_step02.html?recordId=" + child01.recordId;
                successSetTimeOut("第一步保存成功", url);
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