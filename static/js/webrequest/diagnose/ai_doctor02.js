var info = {
    value: '',//我的症状
    docList: [],//医生列表
    diseases: [],//疾病列表
};

/**
 *  获取数据
 * */
function getInfo() {
    try {
        var parments = getQueryString("parments");
        if (parments == null || parments == undefined || parments == "") {
            window.location.href = "/index.html";
            return false;
        }
        var jsonParse = JSON.parse(parments);
        info.value = jsonParse;
        $(".my-dis").html(info.value.value);
        getList();
      
    }
    catch(error){
        errorMsg("加载页面时发生错误");
        return false;
    }
}

/**
 * 跳转到医生主页
 * */
function navigatorDoctor(_id) {
    var url = "/pages/home/doc_page.html?doctorId=" + _id;
    window.location.href = url;
}


/**
 *  获取医生数据和疾病列表
 * */
function getList() {
    var parmets = {
        symptom: info.value.value
    };
    new getRequest({
        url: "/api/doctor/query_disease.json",
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                info.docList = res.data.doctors;
                info.diseases = res.data.diseases;
                if (info.docList.length > 0) {
                    $(".is-more").show();
                }    
                $(".doctor-list").html(template('doctor-div', { list: info.docList }));
                $(".diseases-list").html(template('diseases-div', { list: info.diseases }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

getInfo();