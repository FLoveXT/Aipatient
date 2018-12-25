//需要初始化加载的填写问诊单交互逻辑.js
var common_sex = "";
/**
 *  交互获取层级
 * @param {any} _recordId
 * @param {any} _islast
 * @param {any} _index
 */
function getWriteInfo(_recordId, _islast, _index) {

    var api = "/api/interrogation/getStep/" + _recordId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                var sex = data.sex == "M" ? "男" : "女";
                var template = data.template;
                var step = data.step;
                var two_step = data.two_step;
                var doctorId = data.doctorId;
                common_sex = sex;
                if (_islast == "1") {
                    return false;
                }
                if (step == 0) {
                    var url = '/pages/diagnose/ai_detail.html?doctorId=' + doctorId + "&recordId=" + _recordId;
                    window.location.href = url;
                    return false;
                }
                else if (step == 1) {
                    if (_index == 1) {
                        return false;
                    }
                    var url = '/pages/diagnose/part01.html?recordId=' + _recordId + "&islast=1&doctorId=" + doctorId;
                    window.location.href = url;
                    return false;
                } else {
                    if (template == "儿童") {
                        var url = "";
                        switch (two_step) {
                            case 1:
                                if (_index == 1) {
                                    return false;
                                }
                                url = "/pages/diagnose/child_step01.html?recordId=" + _recordId;
                                break;
                            case 2:
                                if (_index == 2) {
                                    return false;
                                }
                                url = "/pages/diagnose/child_step02.html?recordId=" + _recordId;
                                break;
                            case 3:
                                if (_index == 3) {
                                    return false;
                                }
                                url = "/pages/diagnose/child_step03.html?recordId=" + _recordId;
                                break;
                            default:
                                url = "/";
                                break;
                        }
                        window.location.href = url;
                        return false;
                    }
                    else {
                        var url = '';
                        switch (two_step) {
                            case 1:
                                if (_index == 1) {
                                    return false;
                                }
                                url = "/pages/diagnose/step01.html?recordId=" + _recordId
                                break;
                            case 2:
                                if (_index == 2) {
                                    return false;
                                }
                                url = "/pages/diagnose/step02.html?recordId=" + _recordId
                                break;
                            case 3:
                                if (_index == 3) {
                                    return false;
                                }
                                url = "/pages/diagnose/step03.html?recordId=" + _recordId
                                break;
                            case 4:
                                if (_index == 4) {
                                    return false;
                                }
                                url = "/pages/diagnose/step04.html?recordId=" + _recordId
                                break;
                            case 5:
                                if (_index == 5) {
                                    return false;
                                }
                                if (sex == "男") {
                                    url = "/pages/diagnose/step05-male.html?recordId=" + _recordId
                                } else {
                                    url = "/pages/diagnose/step05-female.html?recordId=" + _recordId
                                }
                                break;
                            default:
                                url = "/";
                                break;
                        }
                        loadSetTimeOut("请稍等", url);
                        return false;
                    }
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
 * 上一步操作
 * @param {any} _recordId  记录ID
 * @param {any} _isChild   是否为儿童
 * @param {any} _step      步骤
 */
function getonenavto(_recordId, _isChild, _step) {
    if (_isChild) {
        var url = "";
        switch (_step) {
            case 1:
                url = "/pages/diagnose/child_step01.html?recordId=" + _recordId + "&islast=1";
                break;
            case 2:
                url = "/pages/diagnose/child_step02.html?recordId=" + _recordId + "&islast=1";
                break;
            default:
                return false
        }
        loadSetTimeOut("请稍等", url);
        return false;
    }
    else {
        var url = "";
        switch (_step) {
            case 1:
                url = "/pages/diagnose/step01.html?recordId=" + _recordId + "&islast=1";
                break;
            case 2:
                url = "/pages/diagnose/step02.html?recordId=" + _recordId + "&islast=1";
                break;
            case 3:
                url = "/pages/diagnose/step03.html?recordId=" + _recordId + "&islast=1";
                break;
            case 4:
                url = "/pages/diagnose/step04.html?recordId=" + _recordId + "&islast=1";
                break;
            default:
                return false
        }
        loadSetTimeOut("请稍等", url);
        return false;
    }
}