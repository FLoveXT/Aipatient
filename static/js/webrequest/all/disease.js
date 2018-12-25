//疾病列表页.js
var diseaselist = [];
/**
 *  加载疾病数据
 * */
function departmentLoad() {
    new getRequest({
        url: "/api/common/list_disease.json",
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                diseaselist = res.data;
                $(".diseaselist-list").html(template('diseaselist-div', { list: diseaselist }))
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