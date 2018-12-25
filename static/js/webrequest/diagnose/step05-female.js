var adult05_F = {
    recordId: '',//记录ID
    isLast: '',//是否是上一页回来
    specialStage: [
        {
            isChecked: false,
            name: "备孕中"
        },
        {
            isChecked: false,
            name: "孕期"
        },
        {
            isChecked: false,
            name: "哺乳期"
        },
        {
            isChecked: false,
            name: "经期"
        },
        {
            isChecked: false,
            name: "更年期"
        },
        {
            isChecked: false,
            name: "无"
        },
    ],
    fertility: [
        {
            isChecked: false,
            name: "无"
        },
        {
            isChecked: false,
            name: "生育1次"
        },
        {
            isChecked: false,
            name: "生育2次及以上"
        },
    ],
    abortion: [
        {
            isChecked: false,
            name: "无"
        },
        {
            isChecked: false,
            name: "流产1次"
        },
        {
            isChecked: false,
            name: "流产2次及以上"
        },
    ],
    menopause: [
        {
            isChecked: false,
            name: "未绝经"
        },
        {
            isChecked: false,
            name: "已绝经"
        },
    ],
    cycle: [
        {
            isChecked: false,
            name: "经期很准（28-30天来一次）"
        },
        {
            isChecked: false,
            name: "经期经常提前（21-28天来一次）"
        },
        {
            isChecked: false,
            name: "经期经常提前（不到21天来一次）"
        },
        {
            isChecked: false,
            name: "经期推后（30-35天来一次）"
        },
        {
            isChecked: false,
            name: "经期推后（超过35天来一次）"
        },
        {
            isChecked: false,
            name: "经期大幅度推后（超过3个月以上没来）"
        },
        {
            isChecked: false,
            name: "经期时而提前，时而推后（推后差距在7天之内）"
        },
    ],
    period: [
        {
            isChecked: false,
            name: "行经期3天以下"
        },
        {
            isChecked: false,
            name: "行经期4-5天"
        },
        {
            isChecked: false,
            name: "行经期6-7天"
        },
        {
            isChecked: false,
            name: "行经期8-10天"
        },
        {
            isChecked: false,
            name: "行经期10天以上"
        },
    ],

    color: [
        {
            isChecked: false,
            name: "月经暗黑"
        },
        {
            isChecked: false,
            name: "月经褐色"
        },
        {
            isChecked: false,
            name: "月经鲜红"
        },
        {
            isChecked: false,
            name: "月经暗红"
        },
        {
            isChecked: false,
            name: "月经淡红,质地稀"
        },
        {
            isChecked: false,
            name: "月经淡红,质地粘绸"
        },
    ],
    quantity: [
        {
            isChecked: false,
            name: "量少（整个经期不足10片卫生巾）"
        },
        {
            isChecked: false,
            name: "中等（整个经期10-20片卫生巾）"
        },
        {
            isChecked: false,
            name: "量多（整个经期超过20片卫生巾）"
        },
        {
            isChecked: false,
            name: "喜凉/持续出血，淋漓不断"
        },
    ],
    clot: [
        {
            isChecked: false,
            name: "有血块（少量）"
        },
        {
            isChecked: false,
            name: "有血块（多）"
        },
        {
            isChecked: false,
            name: "无血块"
        },
    ],
    dysmenorrhoea: [
        {
            isChecked: false,
            name: "无经痛"
        },
        {
            isChecked: false,
            name: "月经前有痛"
        },
        {
            isChecked: false,
            name: "月经后期或月经后又小腹隐痛空痛"
        },
        {
            isChecked: false,
            name: "小腹冷痛（用热水袋可稍微缓解）"
        },
        {
            isChecked: false,
            name: "小腹刺痛（疼痛剧烈，像针扎）"
        },
        {
            isChecked: false,
            name: "小腹隐痛（疼痛不太厉害，按住疼痛减轻）"
        },
        {
            isChecked: false,
            name: "小腹灼热疼痛"
        },
        {
            isChecked: false,
            name: "小腹有坠胀感"
        },
        {
            isChecked: false,
            name: "腰痛"
        },
    ]
    , feel: [
        {
            isChecked: false,
            name: "经前乳涨痛"
        },
        {
            isChecked: false,
            name: "经前腰酸"
        }, {
            isChecked: false,
            name: "经前小腹坠涨"
        },
        {
            isChecked: false,
            name: "经前头痛"
        },
        {
            isChecked: false,
            name: "无以上情况"
        },
    ],
    leucorrheaCapacity: [
        {
            isChecked: false,
            name: "白带多"
        },
        {
            isChecked: false,
            name: "白带少"
        },
    ],
    leucorrhea: [
        {
            isChecked: false,
            name: "无色或白色"
        },
        {
            isChecked: false,
            name: "黄色"
        },
        {
            isChecked: false,
            name: "血性"
        },
        {
            isChecked: false,
            name: "脓性"
        },
        {
            isChecked: false,
            name: "豆腐渣样"
        },
        {
            isChecked: false,
            name: "质地粘稠臭秽"
        },
        {
            isChecked: false,
            name: "质地清稀（如鼻涕）"
        },
    ]
};

/**
 *   特殊阶段
 * */
function teshuClick(_this, _index) {
    for (var i in adult05_F.specialStage) {
        if (i == _index) {
            adult05_F.specialStage[i].isChecked = true;
        } else {
            adult05_F.specialStage[i].isChecked = false;
        }
    }
    console.log(adult05_F.specialStage);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   生育
 * */
function shengyuClick(_this, _index) {
    for (var i in adult05_F.fertility) {
        if (i == _index) {
            adult05_F.fertility[i].isChecked = true;
        } else {
            adult05_F.fertility[i].isChecked = false;
        }
    }
    console.log(adult05_F.fertility);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   流产
 * */
function liuchanClick(_this, _index) {
    for (var i in adult05_F.abortion) {
        if (i == _index) {
            adult05_F.abortion[i].isChecked = true;
        } else {
            adult05_F.abortion[i].isChecked = false;
        }
    }
    console.log(adult05_F.abortion);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   是否绝经（如需选择绝经，后续题目可免填）
 * */
function shifoujuejingClick(_this, _index) {
    for (var i in adult05_F.menopause) {
        if (i == _index) {
            adult05_F.menopause[i].isChecked = true;
        } else {
            adult05_F.menopause[i].isChecked = false;
        }
    }
    console.log(adult05_F.abortion);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *  月经周期
 * */
function yuejingzhouqiClick(_this, _index) {
    for (var i in adult05_F.cycle) {
        if (i == _index) {
            adult05_F.cycle[i].isChecked = true;
        } else {
            adult05_F.cycle[i].isChecked = false;
        }
    }
    console.log(adult05_F.cycle);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   行经期
 * */
function xingjingqiClick(_this, _index) {
    for (var i in adult05_F.period) {
        if (i == _index) {
            adult05_F.period[i].isChecked = true;
        } else {
            adult05_F.period[i].isChecked = false;
        }
    }
    console.log(adult05_F.period);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   经色
 * */
function jingseClick(_this, _index) {
    for (var i in adult05_F.color) {
        if (i == _index) {
            adult05_F.color[i].isChecked = true;
        } else {
            adult05_F.color[i].isChecked = false;
        }
    }
    console.log(adult05_F.color);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   经量
 * */
function jingliangClick(_this, _index) {
    for (var i in adult05_F.quantity) {
        if (i == _index) {
            adult05_F.quantity[i].isChecked = true;
        } else {
            adult05_F.quantity[i].isChecked = false;
        }
    }
    console.log(adult05_F.quantity);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   血块
 * */
function xuekuaiClick(_this, _index) {
    for (var i in adult05_F.clot) {
        if (i == _index) {
            adult05_F.clot[i].isChecked = true;
        } else {
            adult05_F.clot[i].isChecked = false;
        }
    }
    console.log(adult05_F.clot);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *  痛经
 * @param {any} _this
 * @param {any} _index
 */
function tongjingOnclick(_this, _index) {
    var isCheck = false;
    if ($(_this).hasClass("active")) {
        isCheck = false;
        $(_this).removeClass("active");
    }
    else {
        isCheck = true;
        $(_this).addClass("active");
    }
    var active = adult05_F.dysmenorrhoea;
    active[_index].isChecked = isCheck;
    console.log(active);
}

/**
 *   经前感觉
 * */
function jingqianganjueClick(_this, _index) {
    for (var i in adult05_F.feel) {
        if (i == _index) {
            adult05_F.feel[i].isChecked = true;
        } else {
            adult05_F.feel[i].isChecked = false;
        }
    }
    console.log(adult05_F.feel);
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   白带量
 * */
function baidailiangClick(_this, _index) {
    for (var i in adult05_F.leucorrheaCapacity) {
        if (i == _index) {
            adult05_F.leucorrheaCapacity[i].isChecked = true;
        } else {
            adult05_F.leucorrheaCapacity[i].isChecked = false;
        }
    }
    $(_this).addClass("active").siblings().removeClass("active");
}

/**
 *   白带
 * */
function baidaiClick(_this, _index) {
    for (var i in adult05_F.leucorrhea) {
        if (i == _index) {
            adult05_F.leucorrhea[i].isChecked = true;
        } else {
            adult05_F.leucorrhea[i].isChecked = false;
        }
    }
    $(_this).addClass("active").siblings().removeClass("active");
}




function Init() {
    var recordId = getQueryString("recordId");
    if (recordId == undefined || recordId == "" || recordId == null) {
        window.location.href = "/";
        return false;
    }
    adult05_F.recordId = recordId;
    var islast = getQueryString("islast");
    getWriteInfo(recordId, islast, 5);
    if (islast == "1") {
        getdetailInfo();
    }
    else {
        showLoaders();
        setTimeout(function () {
            hideLoaders();
            $(".adult05_F").html(template('adult05_F-div', { list: adult05_F }));
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
    if (adult05_F.menopause != "已绝经") {
        if (adult05_F.cycle == "") {
            errorMsg("请选择月经周期项");
            return false;
        }
        if (adult05_F.period == "") {
            errorMsg("请选择行经期项");
            return false;
        }
        if (adult05_F.color == "") {
            errorMsg("请选择经色项");
            return false;
        }
        if (adult05_F.quantity == "") {
            errorMsg("请选择经量项");
            return false;
        }
        if (adult05_F.clot == "") {
            errorMsg("请选择血块项");
            return false;
        }

        if (adult05_F.dysmenorrhoea.length == 0) {
            errorMsg("请选择痛经项");
            return false;
        }

        if (adult05_F.feel == 0) {
            errorMsg("请选择经前感觉项");
            return false;
        }
        if (adult05_F.leucorrheaCapacity == 0) {
            errorMsg("请选择白带量项");
            return false;
        }
        if (adult05_F.leucorrhea == 0) {
            errorMsg("请选择白带项");
            return false;
        }
    }

    var parments5 = {
        specialStage: adult05_F.specialStage.find(t => t.isChecked == true) ? adult05_F.specialStage.find(t => t.isChecked == true).name : "",
        fertility: adult05_F.fertility.find(t => t.isChecked == true) ? adult05_F.fertility.find(t => t.isChecked == true).name : "",
        abortion: adult05_F.abortion.find(t => t.isChecked == true) ? adult05_F.abortion.find(t => t.isChecked == true).name : "",
        menopause: adult05_F.menopause.find(t => t.isChecked == true) ? adult05_F.menopause.find(t => t.isChecked == true).name : "",
        cycle: adult05_F.cycle.find(t => t.isChecked == true) ? adult05_F.cycle.find(t => t.isChecked == true).name : "",
        period: adult05_F.period.find(t => t.isChecked == true) ? adult05_F.period.find(t => t.isChecked == true).name : "",
        color: adult05_F.color.find(t => t.isChecked == true) ? adult05_F.color.find(t => t.isChecked == true).name : "",
        quantity: adult05_F.quantity.find(t => t.isChecked == true) ? adult05_F.quantity.find(t => t.isChecked == true).name : "",
        clot: adult05_F.clot.find(t => t.isChecked == true) ? adult05_F.clot.find(t => t.isChecked == true).name : "",

        dysmenorrhoea: Enumerable.From(adult05_F.dysmenorrhoea).Where(t => t.isChecked == true).Select(t => t.name).ToArray(),
        feel: adult05_F.feel.find(t => t.isChecked == true) ? adult05_F.feel.find(t => t.isChecked == true).name : "",
        leucorrheaCapacity: adult05_F.leucorrheaCapacity.find(t => t.isChecked == true) ? adult05_F.leucorrheaCapacity.find(t => t.isChecked == true).name : "",
        leucorrhea: adult05_F.leucorrhea.find(t => t.isChecked == true) ? adult05_F.leucorrhea.find(t => t.isChecked == true).name : "",
        supplement: $(".content-value").val()
    };
    console.log(parments5);


    var api = '/api/interrogation/save_template.json';
    var parments = {
        recordId: adult05_F.recordId,
        templateType: 'gynaecology',
        gynaecology: parments5,
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
                var url = "/pages/diagnose/ai_detail.html?recordId=" + adult05_F.recordId;
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
