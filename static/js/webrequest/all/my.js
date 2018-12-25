/*
   我的页面交互
 */
var href = "";
var name = "";
var avatar = "";
var phone = "";
/**
 *  获取用户信息
 * */
function getUserInfo() {
    new getRequest({
        url: "/api/user/user_info.json",
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                avatar = res.data.headImage ? res.data.headImage : "../../static/images/prev-step02-img.png";
                name = res.data.name;
                phone = res.data.phoneNumber;
                href = "";
                /*赋值*/
                $(".req-userinfo").attr("href", href);
                $(".req-avatar").attr("src", avatar);
                $(".req-name").html(name);
                $(".req-phone").html(phone);
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

$(function () {
    getUserInfo();
})