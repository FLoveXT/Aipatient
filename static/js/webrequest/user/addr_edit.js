var edit = {
    action: "",
    id: "",
    detail: {

    },
    prov: '',
    city: '',
    area: '',
    request:''
};

$(function () {
    Init();
})

function Init() {
    var actions = getQueryString("action");
    if (actions == null || actions == undefined || actions == "") {
        edit.action = "add";
    }
    else {
        edit.action = "add";
    }
    var types = getQueryString("types");
    if (types) {
        edit.request = types;
        if (types == "medicine") {
            $("header").remove();
            $("body").addClass("active");
            $(".footer-info").remove();
        }
    }
    if (actions == "edit") {
        edit.action = "edit";    
    }
    var id = getQueryString("id");
    if (id != "") {
        edit.id = id;
        getDetail();
    }
    else {
        $(".detail-item").html(template("detail-div", { list: edit }));
    }
}

function getDetail() {
    var api = "/api/shippingaddress/" + edit.id;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                console.log(res);
                edit.detail = res.data;

                var data = res.data;
                edit.prov = data.provinceName;
                edit.city = data.cityName;
                edit.area = data.countyName;
                $(".detail-item").html(template("detail-div", { list: edit }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  地址库选择
 *  使用京东地址库
 * */
function chooseArea() {
    var $target = $('#AddressAreaInput');
    $target.citySelect();
    $target.on('click', function (event) {
        event.stopPropagation();
        $target.citySelect('open');
    });
    $target.on('done.ydui.cityselect', function (ret) {
        edit.prov = ret.provance;
        edit.city = ret.city;
        edit.area = ret.area;

        $(this).val(ret.provance + ' ' + ret.city + ' ' + ret.area);
    });
}

function Add() {
    var api = '/api/shippingaddress/save.json';
    var name = $("#txtName").val();
    var phone = $("#txtPhone").val();
    var area = $("#txtArea").val();
    if (name == "") {
        errorMsg("请输入收货人")
        return false;
    }
    if (phone == "") {
        errorMsg("请输入联系方式")
        return false;
    }
    if (edit.prov == "") {
        errorMsg("请选择所在地区")
        return false;
    }
    if (name == "") {
        errorMsg("请输入详细地址")
        return false;
    }
    var data = {
        "name": name,
        "provinceName": edit.prov,
        "cityName": edit.city,
        "countyName": edit.area,
        "address": area,
        "preferred": '',
        "phoneNumber": phone
    };
    new postJsonRequest({
        url: api,
        param: JSON.stringify(data),
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var url = "/pages/users/addr.html?types=" + edit.request;
                loadSetTimeOut("", url);
                return false;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function Update() {
    var name = $("#txtName").val();
    var phone = $("#txtPhone").val();
    var area = $("#txtArea").val();
    if (name == "") {
        errorMsg("请输入收货人")
        return false;
    }
    if (phone == "") {
        errorMsg("请输入联系方式")
        return false;
    }
    if (edit.prov=="") {
        errorMsg("请选择所在地区")
        return false;
    }
    if (area == "") {
        errorMsg("请输入详细地址")
        return false;
    }
    var data = {
        "name": name,
        "provinceName": edit.prov,
        "cityName": edit.city,
        "countyName": edit.area,
        "address": area,
        "preferred": '',
        "phoneNumber": phone,
        id: edit.id
    };

    var api = "/api/shippingaddress/update.json";
    new putJsonRequest({
        url: api,
        param: JSON.stringify(data),
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var url = "/pages/users/addr.html?types=" + edit.request;
                loadSetTimeOut("",url);
                return false;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}