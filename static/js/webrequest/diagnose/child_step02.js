//儿童模板-第二步-填写问诊单.js
var child02 = {
    recordId: '',//记录ID
    isLast: '',//是否是上一页回来
    //饮食
    diet: [
        {
            isChecked: false,
            name: "进食较少"
        },
        {
            isChecked: false,
            name: "进食较多"
        },
        {
            isChecked: false,
            name: "正常"
        },
    ],
    //饮水
    water: [
        {
            isChecked: false,
            name: "喝水较少"
        },
        {
            isChecked: false,
            name: "喝水较多"
        },
        {
            isChecked: false,
            name: "正常"
        }
    ],
    //精神
    spirit: [
        {
            isChecked: false,
            name: "精神好"
        },
        {
            isChecked: false,
            name: "精神一般"
        },
        {
            isChecked: false,
            name: "正常"
        }
    ],
    //睡眠
    Sleep: [
        {
            isChecked: false,
            name: "睡眠好"
        },
        {
            isChecked: false,
            name: "睡眠一般"
        },
        {
            isChecked: false,
            name: "睡眠差"
        },
    ],
    //出汗
    Sweating: [
        {
            isChecked: false,
            name: "出汗较少"
        },
        {
            isChecked: false,
            name: "出汗较多"
        },
        {
            isChecked: false,
            name: "正常"
        },
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
    child02.recordId = recordId;
    var islast = getQueryString("islast");
    getWriteInfo(recordId, islast, 2);
    if (islast == "1") {
        getdetailInfo();
    }
    else {
        showLoaders();
        setTimeout(function () {
            hideLoaders();
            $(".child02").html(template('child02-div', { list: child02 }));
        }, 500);
    }
}

/**
 *  获取详情赋值
 * */
function getdetailInfo() {
    var api = '/api/interrogation/' + child02.recordId
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                var basicSituation = data.basicSituation;
                if (basicSituation != null) {
                    var diet = basicSituation.diet;
                    var drink = basicSituation.drink;
                    var spirit = basicSituation.spirit;
                    var sleep = basicSituation.sleep;
                    var sweat = basicSituation.sweat;
                    var supplement = basicSituation.supplement;
                    for (var i in child02.diet) {
                        if (child02.diet[i].name == diet) {
                            child02.diet[i].isChecked = true;
                        }
                    }

                    for (var i in child02.water) {
                        if (child02.water[i].name == drink) {
                            child02.water[i].isChecked = true;
                        }
                    }

                    for (var i in child02.spirit) {
                        if (child02.spirit[i].name == spirit) {
                            child02.spirit[i].isChecked = true;
                        }
                    }

                    for (var i in child02.Sleep) {
                        if (child02.Sleep[i].name == sleep) {
                            child02.Sleep[i].isChecked = true;
                        }
                    }

                    for (var i in child02.Sweating) {
                        if (child02.Sweating[i].name == sweat) {
                            child02.Sweating[i].isChecked = true;
                        }
                    }
                    
                    child02.Description = supplement;
                    console.log(child02);

                    contentWrite(child02.Description);

                    showLoaders();
                    setTimeout(function () {
                        hideLoaders();
                        $(".child02").html(template('child02-div', { list: child02 }));
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
 *  饮食点击事件
 * @param {any} _this
 * @param {any} _index
 */
function yinshiOnclick(_this, _index) {
    for (var i in child02.diet) {
        if (i == _index) {
            child02.diet[i].isChecked = true;
        } else {
            child02.diet[i].isChecked = false;
        }
    }
    console.log(child02.diet);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *  饮水点击事件
 * @param {any} _this
 * @param {any} _index
 */
function yinshuiOnclick(_this, _index) {
    for (var i in child02.water) {
        if (i == _index) {
            child02.water[i].isChecked = true;
        } else {
            child02.water[i].isChecked = false;
        }
    }
    console.log(child02.water);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *  精神点击事件
 * @param {any} _this
 * @param {any} _index
 */
function jingshenOnclick(_this, _index) {
    for (var i in child02.spirit) {
        if (i == _index) {
            child02.spirit[i].isChecked = true;
        } else {
            child02.spirit[i].isChecked = false;
        }
    }
    console.log(child02.spirit);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *  睡眠点击事件
 * @param {any} _this
 * @param {any} _index
 */
function shuiMianOnclick(_this, _index) {
    for (var i in child02.Sleep) {
        if (i == _index) {
            child02.Sleep[i].isChecked = true;
        } else {
            child02.Sleep[i].isChecked = false;
        }
    }
    console.log(child02.Sleep);
    $(_this).addClass("active").siblings().removeClass("active");
}


/**
 *  出汗点击事件
 * @param {any} _this
 * @param {any} _index
 */
function chuhanOnclick(_this, _index) {
    for (var i in child02.Sweating) {
        if (i == _index) {
            child02.Sweating[i].isChecked = true;
        } else {
            child02.Sweating[i].isChecked = false;
        }
    }
    console.log(child02.Sweating);
    $(_this).addClass("active").siblings().removeClass("active");
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
        "diet": child02.diet.find(t => t.isChecked == true) ? child02.diet.find(t => t.isChecked == true).name : "",
        "drink": child02.water.find(t => t.isChecked == true) ? child02.water.find(t => t.isChecked == true).name : "",
        "spirit": child02.spirit.find(t => t.isChecked == true) ? child02.spirit.find(t => t.isChecked == true).name : "",
        "sleep": child02.Sleep.find(t => t.isChecked == true) ? child02.Sleep.find(t => t.isChecked == true).name : "",
        "sweat": child02.Sweating.find(t => t.isChecked == true) ? child02.Sweating.find(t => t.isChecked == true).name : "",
        "supplement": $(".content-value").val()
    };
    var api = '/api/interrogation/save_template.json';
    var parments = {
        recordId: child02.recordId,
        templateType: 'basicSituation',
        basicSituation: array
    };
    var json = JSON.stringify(parments);
    console.log(parments);
    new putJsonRequest({
        url: api,
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                var url = "/pages/diagnose/child_step03.html?recordId=" + child02.recordId;
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

Init();