//售后咨询.js
function showUpload(_this, _fileId, _imgId, _divId, _hideDiv) {
    new imageFileupload({
        id: _fileId,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                $("#" + _imgId).attr("src", res.data.url);
                $("#" + _hideDiv).hide();
                $("#" + _divId).show();
            } else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  去掉图片,还原
 *  _this 当前选择器
 *  _currentDivId 当前需要关闭的DIV
 *  _GcId  当前需要打开的DIV
 *  _imgSrc 需要去掉他的值
 * */
function closeImages(_this, _currentDivId, _GcId, _imgSrc) {
    $("#" + _currentDivId).hide();
    $("#" + _GcId).show();
    $("#" + _imgSrc).attr("src", "");
}

/**
 *  提交售后服务
 * */
function btnConfirm() {
    var content = $("#inputcontent").val();
    if (content.length == 0) {
        errorMsg("请输入点内容吧~");
        return false;
    }
    var images01 = $("#img-box-01").attr("src");
    var images02 = $("#img-box-02").attr("src");

    var array = [images01, images02];
    var pics = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i] != "") {
            pics.push(array[i]);
        }
    }
    var parments = {
        content: content,
        pics: pics
    };
    var json = JSON.stringify(parments);
    new postJsonRequest({
        url: "/api/order/my/after_sales_apply.json",
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                successMsg("提交成功");
                $("#img-box-01").attr("src", "");
                $("#img-box-02").attr("src", "");
                $("#inputcontent").val("");
                $("#div01-box,#div02-box").hide();
                $("#_hideDiv,#_hideDiv02").show();
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}