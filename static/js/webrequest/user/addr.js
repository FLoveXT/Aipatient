var addr = {
    isMidicine: false,
    List: [],
};

$(function () {
    Init();
})

function Init() {
    var types = getQueryString("types");
    if (types != "") {
        addr.isMidicine = true;
        $("header").remove();
        $("body").addClass("active");
        $(".footer-info").remove();
    }
    getlist();
}

function getlist() {
    var api = '/api/shippingaddress/list.json';
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                addr.List = res.data;
                console.log(addr.List);
                $(".addr-list").html(template("addr-div", { list: addr }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

/**
 *  设置默认地址
 * @param {any} _this
 */
function setActiveInfo(_this, _status, _id) {
    YDUI.dialog.confirm('设置提示', '确定修改这个默认地址?', function () {
        var commitInfo = '';
        if (_status == '') {
            commitInfo = 'Y';
        }
        updateActive(commitInfo, _id);
    });
}

function updateActive(option, id) {
    var api = '/api/shippingaddress/set_preferred.json?id=' + id;
    new putRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                successMsg("设置成功");
                getlist();
                return false;
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

function editInfo(_this, _id, _pref) {
    YDUI.dialog.confirm('修改提示', '确定修改这个地址吗?', function () {
        var path = '/pages/users/addr_edit.html?action=edit&id=' + _id + "&preferred=" + _pref;
        loadSetTimeOut("", path);
    });
}

function addAddress() {
    var path = "";
    if (addr.isMidicine) {
        path = '/pages/users/addr_edit.html?action=add&types=medicine';
    } else {
        path = '/pages/users/addr_edit.html?action=add';
    }

    loadSetTimeOut("", path);
}

function divClick(_this) {
    if (!addr.isMidicine) {
        return false;
    }
    var id = $(_this).attr("data-id");
    var address = $(_this).attr("data-address");
    var name = $(_this).attr("data-name");
    var phone = $(_this).attr("data-phone");

    divActiveArray = {
        id: id,
        address: address,
        name: name,
        phone: phone,
        isSelected: true,
    };
    $(_this).addClass("on").siblings().removeClass("on");
    console.log(divActiveArray);
}

var divActiveArray = {
    id: '',
    address: '',
    name: '',
    phone: '',
    isSelected: false,
};

function DeleteBtn(_this,_id) {
    YDUI.dialog.confirm('删除提示', '确定删除这个地址吗?', function () {
        var api = '/api/shippingaddress/delete.json?id=' + _id;
        new deleteRequest({
            url: api,
            isShowLoader: true,
            callBack(res) {
                if (res.code == 200) {
                    successMsg("删除成功");
                    getlist();
                    return false;
                }
                else {
                    errorMsg(res.message);
                    return false;
                }
            }
        })
    });
}