//科室列表页.js
var departlist = [];
/**
 *  加载科室数据
 * */
function departmentLoad() {
    new getRequest({
        url: "/api/common/list_depart.json",
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                departlist = res.data;
                $(".depart-list").html(template('depart-div', { list: departlist }))
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

window.onload = function () {
    departmentLoad();
}