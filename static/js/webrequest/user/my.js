var my = {
    headeImage: "../../static/images/prev-step02-img.png",
    name: "",
    phoneNumber: ""
};

$(function () {

    $(".icon04").addClass("icon04-on");

    Init();
})

function Init() {
    getUserInfo();
}

function getUserInfo() {
    var api = "/api/user/user_info.json";
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                my.headeImage = res.data.headImage ? res.data.headImage : "../../static/images/prev-step02-img.png";
                my.name = res.data.name ? res.data.name : '';
                my.phoneNumber = res.data.phoneNumber ? res.data.phoneNumber:'';
                console.log(my);

                $(".req-img").attr("src", my.headeImage);
                $(".req-name").text(my.name);
                $(".req-phone").text(my.phoneNumber);
                var url = "userinfo.html";
                $(".req-a").attr("href",url);
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}
