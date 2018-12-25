//我的-帮助与反馈.js
var valueMax = 300;
var valueMin = 0;
var btnDisabled = true;

/**
 *  提交帮助反馈
 * */
function getCommitInfo(that) {
    var value = $("textarea").val();
    if (value.length == 0) {
        errorMsg("请填写您的宝贵意见");
        return;
    }
    if (value.length > valueMax) {
        errorMsg("对不起,字数超出了~");
        return;
    }
    var parments = {
        content: value
    };
    var json = JSON.stringify(parments);
    new postJsonRequest({
        url: "/api/feedback/save.json",
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                valueMin = 0;
                valueMax = 300;
                $("#btnCommit").attr("style", "");
                $("#btnCommit").attr("disabled", true)
                $(".zev-first").html(valueMin);
                $(".zev-last").html(valueMax);
                $("textarea").val("");
                successMsg(res.message);
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
 *  检测字符
 *  */
function checkStrInfo(that) {
    var length = $(that).val().length;
    valueMin = length;
    if (length <= valueMax && length > 0) {
       
        $("#btnCommit").removeAttr("disabled", true);
        $("#btnCommit").attr("style", "background:#bc9761");
    }
    else if (length == 0) {
        $("#btnCommit").attr("style", "");
        $("#btnCommit").attr("disabled", true)
    }
    else {
        $("#btnCommit").attr("style", "");
        $("#btnCommit").attr("disabled", true)
        return false;
    }
    valueMin = length;
    $(".zev-first").html(valueMin);
}

$(function () {
    $(".zev-first").html(valueMin);
    $(".zev-last").html(valueMax);
    $("textarea").attr("maxlength", valueMax)
})