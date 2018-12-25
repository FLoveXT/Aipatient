var findArray = {
    myValue: '',
    inputValue: '',
    itemList: []
}

function clear() {
    findArray = {
        myValue: '',
        inputValue: '',
        itemList: []
    }
}

function inputChange(_value, _this) {
    findArray.itemList = [];
    var parmets = {
        searchWord: _value
    };
    new getRequest({
        url: "/api/doctor/query_symptom.json",
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                findArray.itemList = res.data;
                $(".option-list").html(template('item-div', { list: findArray.itemList }));
               // $(_this).val(_value);
                $(".option-list").show();
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  点击选中
 * */
function clickSelected(_this) { 
    var value = $(_this).attr("data-value");

    findArray.myValue = findArray.myValue == '' ? value : findArray.myValue + "+" + value;
    $(".my-diaspone").html(findArray.myValue);
    $(".clear-record").show();
    //滞空对象
    $(".search-input").val("");
    $(".option-list").hide();
    findArray.itemList = [];
    $(".option-list").html("");
    $(".complete-commit").show();

}
// 清空
function clearText(){
    findArray.myValue=''
    $(".header .my-diaspone").text("")
    $(".clear-record").hide();
}

$(function () {

    $(".search-input").val("");

    $(".search-input").bind("input porpertychange", function () {
        let value = $(this).val();
        if (value.length > 0) {
            $(".complete-commit").show();
            $(".option-list").html("");
            findArray.itemList = [];
            inputChange(value, $(this));
        }
        else {
            $(".option-list").hide();
            findArray.itemList = [];
            $(".option-list").html("")
            $(".clear-record").hide();
            $(".complete-commit").hide();
        }
    });
})

function onChange(_this) {
    let value = $(_this).val();
    if (value.length > 0) {
        $(".complete-commit").show();
        $(".option-list").html("");
        findArray.itemList = [];
        inputChange(value, $(this));
    }
}

/**
 *  完成提交
 * */
function completeCommit() {
    if (findArray.myValue == "") {
        errorMsg("请选择一组病况");
        return false;
    }
    var json = {
        value: findArray.myValue
    };
    
    var path = '/pages/diagnose/ai_doctor02.html?parments=' +JSON.stringify(json);
    window.location.href = path;
}