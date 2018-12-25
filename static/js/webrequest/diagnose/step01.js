var adult01 = {
    recordId: '',
    isLast: '',
    water: [
        {
            isChecked: false,
            name: "喝水多"
        },
        {
            isChecked: false,
            name: "喝水少"
        },
        {
            isChecked: false,
            name: "口渴想喝大量的水"
        },
        {
            isChecked: false,
            name: "口渴很不喜欢喝水"
        },
        {
            isChecked: false,
            name: "正常"
        },
    ],
    waterDegree: [
        {
            isChecked: false,
            name: "喜欢喝冷水"
        },
        {
            isChecked: false,
            name: "喜欢喝温热水"
        },
        {
            isChecked: false,
            name: "无偏好"
        },
    ],
    texture: [
        {
            isChecked: false,
            name: "口酸"
        },
        {
            isChecked: false,
            name: "口苦"
        },
        {
            isChecked: false,
            name: "口甜"
        },
        {
            isChecked: false,
            name: "口中辛辣"
        },
        {
            isChecked: false,
            name: "口咸"
        },
        {
            isChecked: false,
            name: "口淡"
        },
        {
            isChecked: false,
            name: "口热"
        },
        {
            isChecked: false,
            name: "口麻"
        },
        {
            isChecked: false,
            name: "口粘"
        },
        {
            isChecked: false,
            name: "晨起口苦"
        },
        {
            isChecked: false,
            name: "嘴唇干燥"
        },
        {
            isChecked: false,
            name: "无以上情况"
        },
    ],
    appetite: [
        {
            isChecked: false,
            name: "胃口好"
        },
        {
            isChecked: false,
            name: "胃口一般"
        },
        {
            isChecked: false,
            name: "胃口较差"
        },
        {
            isChecked: false,
            name: "吃得多单容易饿"
        },
        {
            isChecked: false,
            name: "想吃但吃不下"
        },
    ],
    other: [
        {
            isChecked: false,
            name: "嗳气"
        },
        {
            isChecked: false,
            name: "呃逆（打嗝）"
        },
        {
            isChecked: false,
            name: "反酸"
        },
        {
            isChecked: false,
            name: "胃胀气"
        },
        {
            isChecked: false,
            name: "口气"
        },
        {
            isChecked: false,
            name: "恶心"
        },
        {
            isChecked: false,
            name: "胃有烧心感"
        },
        {
            isChecked: false,
            name: "食道有灼烧感"
        },
        {
            isChecked: false,
            name: "无以上情况"
        },
    ]
};


/**
 *  喝水点击事件
 * @param {any} _this
 * @param {any} _index
 */
function heshuiOnclick(_this, _index) {
    for (var i in adult01.water) {
        if (i == _index) {
            adult01.water[i].isChecked = true;
        } else {
            adult01.water[i].isChecked = false;
        }
    }
    console.log(adult01.water);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   口中感觉
 * */
function kouzhongganjueOnclick(_this, _index) {
    var isCheck = false;
    if ($(_this).hasClass("active")) {
        isCheck = false;
        $(_this).removeClass("active");
    }
    else {
        isCheck = true;
        $(_this).addClass("active");
    }
    var active = adult01.texture;
    active[_index].isChecked = isCheck;
    console.log(active);
}

/**
 *  喜欢喝
 * @param {any} _this
 * @param {any} _index
 */
function xihuanheOnclick(_this, _index) {
    for (var i in adult01.waterDegree) {
        if (i == _index) {
            adult01.waterDegree[i].isChecked = true;
        } else {
            adult01.waterDegree[i].isChecked = false;
        }
    }
    console.log(adult01.waterDegree);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *  胃口
 * @param {any} _this
 * @param {any} _index
 */
function weikouOnclick(_this, _index) {
    for (var i in adult01.appetite) {
        if (i == _index) {
            adult01.appetite[i].isChecked = true;
        } else {
            adult01.appetite[i].isChecked = false;
        }
    }
    console.log(adult01.appetite);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   其他
 * */
function otherOnclick(_this, _index) {
    var isCheck = false;
    if ($(_this).hasClass("active")) {
        isCheck = false;
        $(_this).removeClass("active");
    }
    else {
        isCheck = true;
        $(_this).addClass("active");
    }
    var active = adult01.other;
    active[_index].isChecked = isCheck;
    console.log(active);
}

function Init() {
    var recordId = getQueryString("recordId");
    if (recordId == undefined || recordId == "" || recordId == null) {
        window.location.href = "/";
        return false;
    }
    adult01.recordId = recordId;
    var islast = getQueryString("islast");
    getWriteInfo(recordId, islast, 1);
    if (islast == "1") {
        getdetailInfo();
    }
    else {
        showLoaders();
        setTimeout(function () {
            hideLoaders();
            $(".adult01").html(template('adult01-div', { list: adult01 }));
        }, 500);
    }
}

/**
 *  获取详情赋值
 * */
function getdetailInfo() {
    var api = '/api/interrogation/' + adult01.recordId
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                var diet = data.diet;
                if (diet != null) {
                    var water = diet.water;
                    var waterDegree = diet.waterDegree;
                    var appetite = diet.appetite;
                    var texture = diet.texture;
                    var other = diet.other;
                    var supplement = diet.supplement;
                    for (var i in adult01.water) {

                        if (adult01.water[i].name == water) {
                            adult01.water[i].isChecked = true;
                        }
                    }

                    for (var i in adult01.waterDegree) {
                        if (adult01.waterDegree[i].name == waterDegree) {
                            adult01.waterDegree[i].isChecked = true;
                        }
                    }


                    for (var i in adult01.texture) {
                        if (texture == null || texture == null) {
                            continue;
                        }
                        if (texture.indexOf(adult01.texture[i].name) > -1) {
                            adult01.texture[i].isChecked = true;
                        }
                    }

                    for (var i in adult01.appetite) {
                        if (adult01.appetite[i].name == appetite) {
                            adult01.appetite[i].isChecked = true;
                        }
                    }

                    for (var i in adult01.other) {
                        if (other == null || other == null) {
                            continue;
                        }
                        if (other.indexOf(adult01.other[i].name) > -1) {
                            adult01.other[i].isChecked = true;
                        }
                    }

                    var content = supplement;
                    contentWrite(content);
                    showLoaders();
                    setTimeout(function () {
                        hideLoaders();
                        $(".adult01").html(template('adult01-div', { list: adult01 }));
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
        "water": adult01.water.find(t => t.isChecked == true) ? adult01.water.find(t => t.isChecked == true).name : "",
        "waterDegree": adult01.waterDegree.find(t => t.isChecked == true) ? adult01.waterDegree.find(t => t.isChecked == true).name : "",
        "texture": Enumerable.From(adult01.texture).Where(t => t.isChecked == true).Select(t => t.name).ToArray(),
        "appetite": adult01.appetite.find(t => t.isChecked == true) ? adult01.appetite.find(t => t.isChecked == true).name : "",
        "other": Enumerable.From(adult01.other).Where(t => t.isChecked == true).Select(t => t.name).ToArray(),
        "supplement": $(".content-value").val()
    };
    var api = '/api/interrogation/save_template.json';
    var parments = {
        recordId: adult01.recordId,
        templateType: 'diet',
        diet: array
    };
    var json = JSON.stringify(parments);
    new putJsonRequest({
        url: api,
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                var url = "/pages/diagnose/step02.html?recordId=" + adult01.recordId;
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