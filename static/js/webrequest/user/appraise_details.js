var app_info = {
    orderid: "",
    status: '',
    serverName: '',
    ScoreItems: [],
    updateStatus: false,
    fotmatnewItem:[]
};

$(function () {
    Init();
})

function Init() {
    var orderid = getQueryString("orderid");
    var status = getQueryString("status");
    var array = ["0", "1"];
    if (array.indexOf(status) <= -1) {
        var url = "/pages/users/appraise.html";
        errorSetTimeOut("传输参数错误", url);
        return false;
    }
    app_info.status = status;
    app_info.orderid = orderid;
    getCommentInfo();
}

/**
 *  获取评论详情
 * */
function getCommentInfo() {
    new getRequest({
        url: "/api/appraise/" + app_info.orderid,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                app_info.serverName = data.doctorName + '-' + data.serviceName;
                app_info.ScoreItems = res.items;
                app_info.updateStatus = data.updateStatus
                var array = [];
                var appraises = data.appraises;
                for (var i in res.items) {
                    var tasName = res.items[i].item;
                    var score = 0;
                    var selectvalue = "";
                    var index = -1;
                    if (appraises.length > 0) {
                        for (var p in appraises) {
                            if (appraises[p].item == tasName) {
                                index = p;
                            } else {
                                continue;
                            }
                        }
                        score = appraises[index].score;
                        selectvalue = appraises[index].labels[0];
                        appraises.indexOf(tasName);
                    }
                    var scorearray = [];
                    var selectarray = [];
                    for (var y = 1; y < 6; y++) {
                        if (y <= score) {
                            scorearray.push(true);
                        } else {
                            scorearray.push(false);
                        }
                    }
                    for (var j = 0; j < res.items[i].labels.length; j++) {
                        if (res.items[i].labels[j] == selectvalue) {
                            selectarray.push({
                                value: true,
                                text: res.items[i].labels[j]
                            });
                        } else {
                            selectarray.push({
                                value: false,
                                text: res.items[i].labels[j]
                            });
                        }
                    }
                    array.push({
                        items: res.items[i].labels,
                        tagsname: res.items[i].item,
                        score: scorearray,
                        selectvalue: selectarray
                    });
                }
                app_info.fotmatnewItem = array;
                console.log(app_info.fotmatnewItem);
                $(".app-list").html(template('app-div', { list: app_info }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function updateInfo() {
    if (app_info.status != "0") {
        if (!app_info.updateStatus) {
            errorMsg("该评价待审中");
            return false;
        }
    }
    var api = '/api/appraise/update.json';
    var data = app_info.fotmatnewItem;
    var appraises = [];
    for (var i = 0; i < data.length; i++) {
        var item = data[i].tagsname;
        var score = 0;
        for (var y = 0; y < data[i].score.length; y++) {
            if (data[i].score[y]) {
                score++;
            }
        }
        var labels = [];
        for (var j = 0; j < data[i].selectvalue.length; j++) {
            if (data[i].selectvalue[j].value) {
                labels.push(data[i].selectvalue[j].text);
            }
        }
        appraises.push({
            item: item,
            score: score,
            labels: labels
        });
    }
    var paremnts = {
        orderId: app_info.orderid,
        appraises: appraises
    };
    var json = JSON.stringify(paremnts);
    new putJsonRequest({
        url: api,
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                var url = "/pages/users/appraise.html";
                successSetTimeOut("成功,跳转中...", url);
                return false;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function Insert() {
    var api = '/api/appraise/save.json';
    var data = app_info.fotmatnewItem;
    var appraises = [];
    for (var i = 0; i < data.length; i++) {
        var item = data[i].tagsname;
        var score = 0;
        for (var y = 0; y < data[i].score.length; y++) {
            if (data[i].score[y]) {
                score++;
            }
        }
        var labels = [];
        for (var j = 0; j < data[i].selectvalue.length; j++) {
            if (data[i].selectvalue[j].value) {
                labels.push(data[i].selectvalue[j].text);
            }
        }
        appraises.push({
            item: item,
            score: score,
            labels: labels
        });
    }
    var parments = {
        orderId: app_info.orderid,
        appraises: appraises
    };
    console.log(parments);
    var json = JSON.stringify(parments);
    new postJsonRequest({
        url: api,
        isShowLoader: true,
        param: json,
        callBack(res) {
            if (res.code == 200) {
                var url = "/pages/users/appraise.html";
                successSetTimeOut("成功,跳转中...", url);
                return false;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })

}

function resetStatChange(_this,_index, _parentIndex) {
    console.log("子级:" + _index + ",父级:" + _parentIndex);
    if (app_info.status != "0") {
        if (!app_info.updateStatus) {
            return false;
        }
    }
    var array = app_info.fotmatnewItem;
    var current = app_info.fotmatnewItem[_parentIndex].selectvalue;
    var cc = [];
    for (var i = 0; i < current.length; i++) {
        cc.push({
            value: false,
            text: current[i].text
        });
    }
    current = cc;

    //清除文字选中
    app_info.fotmatnewItem[_parentIndex].selectvalue = cc;
    //清除评分选中       
    var score = app_info.fotmatnewItem[_parentIndex].score;
    var dd = [false, false, false, false, false];
    
    app_info.fotmatnewItem[_parentIndex].score = dd;
    console.log(app_info.fotmatnewItem[_parentIndex]);

    //清除HTML选中
    $(_this).parents(".item").find(".star text").removeClass("active");
    $(_this).parents(".item").find(".choice text").removeClass("active");
    return false;
  
}

/**
 *  选中
 * */
function selectActiveChange(_this, currentindex, _parentindex, isactive) {
  var active=   isactive == "true" ? false : true;
    if (app_info.status != "0") {
        if (!app_info.updateStatus) {
            return false;
        }
    }
    var current = app_info.fotmatnewItem[_parentindex].selectvalue;
    var array = [];
    for (var i = 0; i < current.length; i++) {
        array.push({
            value: false,
            text: current[i].text
        });
    }
    app_info.fotmatnewItem[_parentindex].selectvalue = array;  
    app_info.fotmatnewItem[_parentindex].selectvalue[currentindex].value = active;
    console.log(app_info.fotmatnewItem[_parentindex]);
    $(_this).addClass("active").siblings().removeClass("active");
}

function startActiveChange(_this, currentindex, _parentindex, isactive) {
    var active = isactive == "true" ? false : true;
    if (app_info.status != "0") {
        if (!app_info.updateStatus) {
            return false;
        }
    }
    var array = [];
    for (var i = 0; i < 5; i++) {
        if (i <= currentindex) {
            array.push(true);
        } else {
            array.push(false);
        }
    }
    var currentarray = app_info.fotmatnewItem[_parentindex].score;
    app_info.fotmatnewItem[_parentindex].score = array;
    console.log(app_info.fotmatnewItem[_parentindex]);

    for (var i in array) {
        if (array[i] == true) {
            $(_this).parent(".star").find("text").eq(i).removeClass("active").addClass("active");
        }
        else {
            $(_this).parent(".star").find("text").eq(i).removeClass("active");
        }
    }
}