var adult05_M = {
    recordId: '',//记录ID
    isLast: '',//是否是上一页回来
    //大便次数
    sexualFunction: [
        {
            isChecked: false,
            name: "早泄"
        },
        {
            isChecked: false,
            name: "阳痿"
        },
        {
            isChecked: false,
            name: "勃起不坚"
        },
        {
            isChecked: false,
            name: "晨勃消失"
        },
        {
            isChecked: false,
            name: "频繁遗精"
        },
        {
            isChecked: false,
            name: "频繁滑精"
        },
        {
            isChecked: false,
            name: "无以上情况"
        },
    ],
    andrology: [
        {
            isChecked: false,
            name: "不育"
        },
        {
            isChecked: false,
            name: "前列腺炎"
        },
        {
            isChecked: false,
            name: "附睾炎"
        },
        {
            isChecked: false,
            name: "睾丸炎"
        },
        {
            isChecked: false,
            name: "尿道炎"
        },
        {
            isChecked: false,
            name: "无以上情况"
        },
    ],
};

/**
 *   性功能问题
 * */
function xinggongnengOnclick(_this, _index) {
    for (var i in adult05_M.sexualFunction) {
        if (i == _index) {
            adult05_M.sexualFunction[i].isChecked = true;
        } else {
            adult05_M.sexualFunction[i].isChecked = false;
        }
    }
    console.log(adult05_M.sexualFunction);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   男科问题
 * */
function nankewentiOnclick(_this, _index) {
    for (var i in adult05_M.andrology) {
        if (i == _index) {
            adult05_M.andrology[i].isChecked = true;
        } else {
            adult05_M.andrology[i].isChecked = false;
        }
    }
    console.log(adult05_M.andrology);
    $(_this).addClass("active").siblings().removeClass("active");
}

function Init() {
    var recordId = getQueryString("recordId");
    if (recordId == undefined || recordId == "" || recordId == null) {
        window.location.href = "/";
        return false;
    }
    adult05_M.recordId = recordId;
    var islast = getQueryString("islast");
    getWriteInfo(recordId, islast, 5);
    if (islast == "1") {
        getdetailInfo();
    }
    else {
        showLoaders();
        setTimeout(function () {
            hideLoaders();
            $(".adult05_M").html(template('adult05_M-div', { list: adult05_M }));
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
        "sexualFunction": adult05_M.sexualFunction.find(t => t.isChecked == true) ? adult05_M.sexualFunction.find(t => t.isChecked == true).name : "",
        "shape": adult05_M.andrology.find(t => t.isChecked == true) ? adult05_M.andrology.find(t => t.isChecked == true).name : "",
        "supplement": $(".content-value").val()
    };
    var api = '/api/interrogation/save_template.json';
    var parments = {
        recordId: adult05_M.recordId,
        templateType: 'andrology',
        andrology: array,
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
                var url = "/pages/diagnose/ai_detail.html?recordId=" + adult05_M.recordId;
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
