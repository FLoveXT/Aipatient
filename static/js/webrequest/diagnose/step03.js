var adult03 = {
    recordId: '',
    isLast: '',
    fallAsleep: [{
        isChecked: false,
        name: "很难睡着"
    },
    {
        isChecked: false,
        name: "正常入睡"
    }],
    quality: [
        {
            isChecked: false,
            name: "睡眠深"
        },
        {
            isChecked: false,
            name: "睡眠浅、易醒"
        },
        {
            isChecked: false,
            name: "易失眠"
        }
    ],
    wakeUp: [
        {
            isChecked: false,
            name: "经常夜醒"
        },
        {
            isChecked: false,
            name: "很少夜醒"
        }
    ]
    , dream: [
        {
            isChecked: false,
            name: "经常做梦，但睡醒就不记得"
        },
        {
            isChecked: false,
            name: "经常做噩梦"
        },
        {
            isChecked: false,
            name: "偶尔做梦"
        },
        {
            isChecked: false,
            name: "无"
        }
    ],
    other: [
        {
            isChecked: false,
            name: "易怒"
        },
        {
            isChecked: false,
            name: "易悲"
        },
        {
            isChecked: false,
            name: "易燥"
        },
        {
            isChecked: false,
            name: "易抑郁"
        },
        {
            isChecked: false,
            name: "健忘"
        },
        {
            isChecked: false,
            name: "易焦虑"
        },
        {
            isChecked: false,
            name: "易受惊吓"
        },
        {
            isChecked: false,
            name: "喜欢热闹"
        },
        {
            isChecked: false,
            name: "喜欢安静"
        },
        {
            isChecked: false,
            name: "爱叹气"
        },
        {
            isChecked: false,
            name: "思虑较多"
        },
        {
            isChecked: false,
            name: "平时压力大"
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
    adult03.recordId = recordId;
    var islast = getQueryString("islast");
    getWriteInfo(recordId, islast, 3);
    if (islast == "1") {
        getdetailInfo();
    }
    else {
        showLoaders();
        setTimeout(function () {
            hideLoaders();
            $(".adult03").html(template('adult03-div', { list: adult03 }));
        }, 500);
    }
}

/**
 *  获取详情赋值
 * */
function getdetailInfo() {
    var api = '/api/interrogation/' + adult03.recordId
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                var diet = data.sleepMood
                if (diet != null) {
                    var fallAsleep = diet.fallAsleep;
                    var quality = diet.quality;
                    var wakeUp = diet.wakeUp;
                    var dream = diet.dream;
                    var other = diet.other;
                    var supplement = diet.supplement;
                    for (var i in adult03.fallAsleep) {
                        if (adult03.fallAsleep[i].name == fallAsleep) {
                            adult03.fallAsleep[i].isChecked = true;
                        }
                    }

                    for (var i in adult03.quality) {
                        if (adult03.quality[i].name == quality) {
                            adult03.quality[i].isChecked = true;
                        }
                    }

                    for (var i in adult03.wakeUp) {
                        if (wakeUp == null || wakeUp == null) {
                            continue;
                        }
                        if (wakeUp.indexOf(adult03.wakeUp[i].name) > -1) {
                            adult03.wakeUp[i].isChecked = true;
                        }
                    }                
                    for (var i in adult03.dream) {
                        if (adult03.dream[i].name == dream) {
                            adult03.dream[i].isChecked = true;
                        }
                    }
                    for (var i in adult03.other) {
                        if (other == null || other == null) {
                            continue;
                        }
                        if (other.indexOf(adult03.other[i].name) > -1) {
                            adult03.other[i].isChecked = true;
                        }
                    }
                    var content = supplement;
                    contentWrite(content);
                    showLoaders();
                    setTimeout(function () {
                        hideLoaders();
                        $(".adult03").html(template('adult03-div', { list: adult03 }));
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
 *  入睡点击事件
 * @param {any} _this
 * @param {any} _index
 */
function rushuiOnclick(_this, _index) {
    for (var i in adult03.fallAsleep) {
        if (i == _index) {
            adult03.fallAsleep[i].isChecked = true;
        } else {
            adult03.fallAsleep[i].isChecked = false;
        }
    }
    console.log(adult03.fallAsleep);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *  质量点击事件
 * @param {any} _this
 * @param {any} _index
 */
function zhiliangOnclick(_this, _index) {
    for (var i in adult03.quality) {
        if (i == _index) {
            adult03.quality[i].isChecked = true;
        } else {
            adult03.quality[i].isChecked = false;
        }
    }
    console.log(adult03.quality);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   夜醒
 * */
function yexingClick(_this, _index) {
    var isCheck = false;
    if ($(_this).hasClass("active")) {
        isCheck = false;
        $(_this).removeClass("active");
    }
    else {
        isCheck = true;
        $(_this).addClass("active");
    }
    var active = adult03.wakeUp;
    active[_index].isChecked = isCheck;
    console.log(active);
}

/**
 *  梦点击事件
 * @param {any} _this
 * @param {any} _index
 */
function mengOnclick(_this, _index) {
    for (var i in adult03.dream) {
        if (i == _index) {
            adult03.dream[i].isChecked = true;
        } else {
            adult03.dream[i].isChecked = false;
        }
    }
    console.log(adult03.dream);
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
    var active = adult03.other;
    active[_index].isChecked = isCheck;
    console.log(active);
}




/**
 *  提交
 * */
function commitInfo() {
    var array = {
        "fallAsleep": adult03.fallAsleep.find(t => t.isChecked == true) ? adult03.fallAsleep.find(t => t.isChecked == true).name : "",
        "quality": adult03.quality.find(t => t.isChecked == true) ? adult03.quality.find(t => t.isChecked == true).name : "",
        "wakeUp": Enumerable.From(adult03.wakeUp).Where(t => t.isChecked == true).Select(t => t.name).ToArray(),
        "other": Enumerable.From(adult03.other).Where(t => t.isChecked == true).Select(t => t.name).ToArray(),
        "dream": adult03.dream.find(t => t.isChecked == true) ? adult03.dream.find(t => t.isChecked == true).name : "",
        "supplement": $(".content-value").val()
    };
    var api = '/api/interrogation/save_template.json';
    var parments = {
        recordId: adult03.recordId,
        templateType: 'sleepMood',
        sleepMood: array
    };
    var json = JSON.stringify(parments);
    new putJsonRequest({
        url: api,
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                var url = "/pages/diagnose/step04.html?recordId=" + adult03.recordId;
                successSetTimeOut("第三步保存成功", url);
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

/**
 *   字符串补充说明
 * */
function valueStrCheck(that) {
    var length = $(that).val().length;
    var valueMin = length;
    $(".zev-min").html(valueMin);
}

Init();