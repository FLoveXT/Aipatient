
//个人资料.js
/**
 *  普通上传-
 * @param {any} _this 包括层级的-点击事件触发者
 * @param {any} _id   input[type='file']  H5标签accept) accept="image/*"
 * @param {any} _imgTags img标签,用于填充src地址
 * 开发者只要在此方法中扩展callback就行了,
 */
function onclickInfo(_this, _id,_imgTags) {
    new imageFileupload({
        id: _id,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                $("#"+_imgTags).attr("src",res.data.url)
            } else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  提交用户资料
 * */
function commitUserInfo() {
    var name = $("#inputName").val();
    var sex = $(".checkbox:checked").val();
    var age = $("#inputNum").val();
    var avatar = $("#avatar_info").attr("src");
    if (!name || !sex || !age || !avatar) {
        errorMsg("请填写完整资料");
        return false;
    }
    var parments = {
        "headImage": avatar,
        "name": name,
        "sex": sex,
        "age": age
    };
    var json = JSON.stringify(parments);
    new putJsonRequest({
        url: "/api/user/update_user_info.json",
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                //跳转到我的页面
                loadSetTimeOut("请稍等","my.html");
                return false;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

var my = {
    headeImage: "../../static/images/prev-step02-img.png",
    name: "",
    phoneNumber: "",
    sex: '',
    age:''
    
};

$(function () {
    Init();
})

function Init() {
    var api = "/api/user/user_info.json";
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                my.headeImage = res.data.headImage ? res.data.headImage : "../../static/images/prev-step02-img.png";
                my.name = res.data.name ? res.data.name : '';
                my.phoneNumber = res.data.phoneNumber ? res.data.phoneNumber : '';
                my.sex = res.data.sex ? res.data.sex : '男';
                my.age = res.data.age ? res.data.age : 0;
                console.log(my);
                $(".req-name").text(my.name);
                $(".req-avatar").attr("src", my.headeImage);
                $("#inputName").val(my.name);
                $("input[name='inputSex'][value='" + my.sex + "']").attr("checked", true);
                $("#inputNum").val(my.age);
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}


function checkAttr(_this, _index) {
    $(_this).attr("checked", true);
    // $(".checkbox").eq(!_index).removeAttr("checked", true);
}