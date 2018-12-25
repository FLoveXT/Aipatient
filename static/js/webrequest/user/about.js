
function aboutInfo() {
    new getRequest({
        url: "/api/home/about_us.json",
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                $(".about-content").html(res.data.content);
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

aboutInfo();