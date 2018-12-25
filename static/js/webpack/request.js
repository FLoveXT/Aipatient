//const urlpath = "https://patient.5aszy.com";
/**
 *  Request.js 
 *  Author:zev
 *  Date:2018-08-15
 * */
const urlpath = "https://www.5aszy.com";
const weixinUrl = "http://www.5aszy.com/";
(function () {
	/**
	 *  AJAX请求GET
	 */
    function getRequest(opts) {
        this.url = urlpath + opts.url;
        this.param = opts.param || {};
        this.isShowLoader = opts.isShowLoader || false;
        this.callBack = opts.callBack;
        this.init();
    }
    getRequest.prototype = {
        init() {
            this.sendRequest();
        },
        showLoader() {
            if (this.isShowLoader) {
                showLoaders();
            }

        },
        hideLoader() {
            if (this.isShowLoader) {
                hideLoaders();
            }
        },
        sendRequest() {
            var self = this;
            $.ajax({
                type: "get",
                url: this.url,
                data: this.param,
                dataType: "json",
                beforeSend: function (xhr) {
                    if (self.isShowLoader) {
                        showLoaders();
                    }
                    var token = localStorage.getItem("token") == null ? "" : localStorage.getItem("token");
                    xhr.setRequestHeader("token", token);
                    xhr.setRequestHeader("wx_version", "1.0");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                success: function (res) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                    if (res != null && res != "") {
                        if (self.callBack) {
                            if (Object.prototype.toString.call(self.callBack) === "[object Function]") {
                                var code = res.code;
                                if (code != 200) {
                                    errorLogs(res);
                                    return false;
                                }
                                else {
                                    self.callBack(res);
                                }
                            } else {
                                errorMsg("系统异常");
                                return false;
                            }
                        }
                    }
                },
                error: function (error) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                }
            });
        }
    }

	/**
	 *  AJAX请求POST
	 */
    function postRequest(opts) {
        this.url = urlpath + opts.url;
        this.param = opts.param || {};
        this.isShowLoader = opts.isShowLoader || false;
        this.callBack = opts.callBack;
        this.init();
    }
    postRequest.prototype = {
        init() {
            this.sendRequest();
        },
        showLoader() {
            if (this.isShowLoader) {
                showLoaders();
            }
        },
        hideLoader() {
            if (this.isShowLoader) {
                hideLoaders();
            }
        },
        sendRequest() {
            var self = this;
            $.ajax({
                type: "POST",
                url: this.url,
                data: this.param,
                dataType: "json",
                beforeSend: function (xhr) {
                    if (self.isShowLoader) {
                        showLoaders();
                    }
                    var token = localStorage.getItem("token") == null ? "" : localStorage.getItem("token");
                    xhr.setRequestHeader("token", token);
                    xhr.setRequestHeader("wx_version", "1.0");
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                },
                success: function (res) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                    if (res != null && res != "") {
                        if (self.callBack) {
                            if (Object.prototype.toString.call(self.callBack) === "[object Function]") {
                                var code = res.code;
                                if (code != 200) {
                                    errorLogs(res);
                                    return false;
                                }
                                else {
                                    self.callBack(res);
                                }
                            } else {
                                errorMsg("系统异常");
                                return false;
                            }
                        }
                    }
                },
                error: function (error) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                }
            });
        }
    }





	/**
	 *  AJAX请求POST-JSON
	 */
    function postJsonRequest(opts) {
        this.url = urlpath + opts.url;
        this.param = opts.param || {};
        this.isShowLoader = opts.isShowLoader || false;
        this.callBack = opts.callBack;
        this.init();
    }
    postJsonRequest.prototype = {
        init() {
            this.sendRequest();
        },
        showLoader() {
            if (this.isShowLoader) {
                showLoaders();
            }
        },
        hideLoader() {
            if (this.isShowLoader) {
                hideLoaders();
            }
        },
        sendRequest() {
            var self = this;
            $.ajax({
                type: "POST",
                url: this.url,
                data: this.param,
                dataType: "json",
                beforeSend: function (xhr) {
                    if (self.isShowLoader) {
                        showLoaders();
                    }
                    var token = localStorage.getItem("token") == null ? "" : localStorage.getItem("token");
                    xhr.setRequestHeader("token", token);
                    xhr.setRequestHeader("wx_version", "1.0");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                success: function (res) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                    if (res != null && res != "") {
                        if (self.callBack) {
                            if (Object.prototype.toString.call(self.callBack) === "[object Function]") {
                                var code = res.code;
                                if (code != 200) {
                                    errorLogs(res);
                                    return false;
                                }
                                else {
                                    self.callBack(res);
                                }
                            } else {
                                errorMsg("系统异常");
                                return false;
                            }
                        }
                    }
                },
                error: function (error) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                }
            });
        }
    }

    function imageFileupload(opts) {
        this.callBack = opts.callBack;
        this.id = opts.id;
        this.isShowLoader = opts.isShowLoader || false;
        this.init();
    }

    imageFileupload.prototype = {
        init() {
            this.bindFormData();
            this.sendRequest();
        },
        showLoader() {
            if (this.isShowLoader) {
                showLoaders();
            }
        },
        bindFormData() {
            $("#" + this.id).bind('fileuploadsubmit', function (e, data) {
                console.log("data");
                console.log(data);
                data.formData = { type: "MINI", image: data.files[0] };
            })
        },
        hideLoader() {
            if (this.isShowLoader) {
                hideLoaders();
            }
        },
        sendRequest() {
            var self = this;
            $("#" + this.id).fileupload({
                dataType: "json",
                url: urlpath + "/api/common/upload_image.json",
                beforeSend: function (xhr) {
                    if (self.isShowLoader) {
                        showLoaders();
                    }
                    var token = localStorage.getItem("token") == null ? "" : localStorage.getItem("token");
                    xhr.setRequestHeader("token", token);
                //    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                },
                change: function (e, data) {

                }, add: function (e, data) {
                    data.submit();
                }
                , done: function (e, res) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                    if (res != null && res != "") {
                        if (self.callBack) {
                            if (Object.prototype.toString.call(self.callBack) === "[object Function]") {
                                var code = res.result.code;
                                if (code != 200) {
                                    errorLogs(res.result);
                                    return false;
                                }
                                else {
                                    self.callBack(res.result);
                                }
                            } else {
                                errorMsg("系统异常");
                                return false;
                            }
                        }
                    }
                    else {
                        errorMsg("系统异常");
                        return false;
                    }
                }
            })
        }
    }

    /**
	 *  AJAX请求PUT-JSON
	 */
    function putJsonRequest(opts) {
        this.url = urlpath + opts.url;
        this.param = opts.param || {};
        this.isShowLoader = opts.isShowLoader || false;
        this.callBack = opts.callBack;
        this.init();
    }
    putJsonRequest.prototype = {
        init() {
            this.sendRequest();
        },
        showLoader() {
            if (this.isShowLoader) {
                showLoaders();
            }
        },
        hideLoader() {
            if (this.isShowLoader) {
                hideLoaders();
            }
        },
        sendRequest() {
            var self = this;
            $.ajax({
                type: "put",
                url: this.url,
                data: this.param,
                dataType: "json",
                beforeSend: function (xhr) {
                    if (self.isShowLoader) {
                        showLoaders();
                    }
                    var token = localStorage.getItem("token") == null ? "" : localStorage.getItem("token");
                    xhr.setRequestHeader("token", token);
                    xhr.setRequestHeader("wx_version", "1.0");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                success: function (res) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                    if (res != null && res != "") {
                        if (self.callBack) {
                            if (Object.prototype.toString.call(self.callBack) === "[object Function]") {
                                var code = res.code;
                                if (code != 200) {
                                    errorLogs(res);
                                    return false;
                                }
                                else {
                                    self.callBack(res);
                                }
                            } else {
                                errorMsg("系统异常");
                                return false;
                            }
                        }
                    }
                },
                error: function (error) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                }
            });
        }
    }



    /**
	 *  AJAX请求PUT
	 */
    function putRequest(opts) {
        this.url = urlpath + opts.url;
        this.param = opts.param || {};
        this.isShowLoader = opts.isShowLoader || false;
        this.callBack = opts.callBack;
        this.init();
    }
    putRequest.prototype = {
        init() {
            this.sendRequest();
        },
        showLoader() {
            if (this.isShowLoader) {
                showLoaders();
            }
        },
        hideLoader() {
            if (this.isShowLoader) {
                hideLoaders();
            }
        },
        sendRequest() {
            var self = this;
            $.ajax({
                type: "put",
                url: this.url,
                data: this.param,
                dataType: "json",
                beforeSend: function (xhr) {
                    if (self.isShowLoader) {
                        showLoaders();
                    }
                    var token = localStorage.getItem("token") == null ? "" : localStorage.getItem("token");
                    xhr.setRequestHeader("token", token);
                    xhr.setRequestHeader("wx_version", "1.0");
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                },
                success: function (res) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                    if (res != null && res != "") {
                        if (self.callBack) {
                            if (Object.prototype.toString.call(self.callBack) === "[object Function]") {
                                var code = res.code;
                                if (code != 200) {
                                    errorLogs(res);
                                    return false;
                                }
                                else {
                                    self.callBack(res);
                                }
                            } else {
                                errorMsg("系统异常");
                                return false;
                            }
                        }
                    }
                },
                error: function (error) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                }
            });
        }
    }






	/**
	 *  AJAX请求POST-JSON
	 */
    function postLoginJsonRequest(opts) {
        this.url = urlpath + opts.url;
        this.param = opts.param || {};
        this.isShowLoader = opts.isShowLoader || false;
        this.callBack = opts.callBack;
        this.init();
    }
    postLoginJsonRequest.prototype = {
        init() {
            this.sendRequest();
        },
        showLoader() {
            if (this.isShowLoader) {
                showLoaders();
            }
        },
        hideLoader() {
            if (this.isShowLoader) {
                hideLoaders();
            }
        },
        sendRequest() {
            var self = this;
            $.ajax({
                type: "POST",
                url: this.url,
                data: this.param,
                dataType: "json",
                beforeSend: function (xhr) {
                    if (self.isShowLoader) {
                        showLoaders();
                    }
                    xhr.setRequestHeader("wx_version", "1.0");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                success: function (res) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                    if (res != null && res != "") {
                        if (self.callBack) {
                            if (Object.prototype.toString.call(self.callBack) === "[object Function]") {
                                var code = res.code;
                                if (code != 200) {
                                    errorLogs(res);
                                    return false;
                                }
                                else {
                                    self.callBack(res);
                                }
                            } else {
                                errorMsg("系统异常");
                                return false;
                            }
                        }
                    }
                },
                error: function (error) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                }
            });
        }
    }


    /**
 *  AJAX请求DELETE
 */
    function deleteRequest(opts) {
        this.url = urlpath + opts.url;
        this.param = opts.param || {};
        this.isShowLoader = opts.isShowLoader || false;
        this.callBack = opts.callBack;
        this.init();
    }
    deleteRequest.prototype = {
        init() {
            this.sendRequest();
        },
        showLoader() {
            if (this.isShowLoader) {
                showLoaders();
            }

        },
        hideLoader() {
            if (this.isShowLoader) {
                hideLoaders();
            }
        },
        sendRequest() {
            var self = this;
            $.ajax({
                type: "delete",
                url: this.url,
                data: this.param,
                dataType: "json",
                beforeSend: function (xhr) {
                    if (self.isShowLoader) {
                        showLoaders();
                    }
                    var token = localStorage.getItem("token") == null ? "" : localStorage.getItem("token");
                    xhr.setRequestHeader("token", token);
                    xhr.setRequestHeader("wx_version", "1.0");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                success: function (res) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                    if (res != null && res != "") {
                        if (self.callBack) {
                            if (Object.prototype.toString.call(self.callBack) === "[object Function]") {
                                var code = res.code;
                                if (code != 200) {
                                    errorLogs(res);
                                    return false;
                                }
                                else {
                                    self.callBack(res);
                                }
                            } else {
                                errorMsg("系统异常");
                                return false;
                            }
                        }
                    }
                },
                error: function (error) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                }
            });
        }
    }


    function imageMitFileupload(opts) {
        this.callBack = opts.callBack;
        this.id = opts.id;
        this.isShowLoader = opts.isShowLoader || false;
        this.init();
    }

    imageMitFileupload.prototype = {
        init() {
            this.bindFormData();
            this.sendRequest();
        },
        showLoader() {
            if (this.isShowLoader) {
                showLoaders();
            }
        },
        bindFormData() {
            $("#" + this.id).bind('fileuploadsubmit', function (e, data) {
                console.log("data");
                console.log(data);
                data.formData = { type: "MINI", image: data.files };
            })
        },
        hideLoader() {
            if (this.isShowLoader) {
                hideLoaders();
            }
        },
        sendRequest() {
            var self = this;
            $("#" + this.id).fileupload({
                dataType: "json",
                url: urlpath + "/api/common/upload_image.json",
                beforeSend: function (xhr) {
                    if (self.isShowLoader) {
                        showLoaders();
                    }
                    var token = localStorage.getItem("token") == null ? "" : localStorage.getItem("token");
                    xhr.setRequestHeader("token", token);
                    //    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                },
                change: function (e, data) {

                }, add: function (e, data) {
                    data.submit();
                }
                , done: function (e, res) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                    if (res != null && res != "") {
                        if (self.callBack) {
                            if (Object.prototype.toString.call(self.callBack) === "[object Function]") {
                                var code = res.result.code;
                                if (code != 200) {
                                    errorLogs(res.result);
                                    return false;
                                }
                                else {
                                    self.callBack(res.result);
                                }
                            } else {
                                errorMsg("系统异常");
                                return false;
                            }
                        }
                    }
                    else {
                        errorMsg("系统异常");
                        return false;
                    }
                }
            })
        }
    }



    /**
	 *  AJAX请求GET
	 */
    function getNoResultRequest(opts) {
        this.url = urlpath + opts.url;
        this.param = opts.param || {};
        this.isShowLoader = opts.isShowLoader || false;
        this.callBack = opts.callBack;
        this.init();
    }
    getNoResultRequest.prototype = {
        init() {
            this.sendRequest();
        },
        showLoader() {
            if (this.isShowLoader) {
                showLoaders();
            }

        },
        hideLoader() {
            if (this.isShowLoader) {
                hideLoaders();
            }
        },
        sendRequest() {
            var self = this;
            $.ajax({
                type: "get",
                url: this.url,
                data: this.param,
                dataType: "json",
                beforeSend: function (xhr) {
                    if (self.isShowLoader) {
                        showLoaders();
                    }
                    var token = localStorage.getItem("token") == null ? "" : localStorage.getItem("token");
                    xhr.setRequestHeader("token", token);
                    xhr.setRequestHeader("wx_version", "1.0");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                success: function (res) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                    if (res != null && res != "") {
                        if (self.callBack) {
                            if (Object.prototype.toString.call(self.callBack) === "[object Function]") {
                                var code = res.code;
                                self.callBack(res);
                            } else {
                                errorMsg("系统异常");
                                return false;
                            }
                        }
                    }
                },
                error: function (error) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                }
            });
        }
    }


    function postNoResultRequest(opts) {
        this.url = urlpath + opts.url;
        this.param = opts.param || {};
        this.isShowLoader = opts.isShowLoader || false;
        this.callBack = opts.callBack;
        this.init();
    }
    postNoResultRequest.prototype = {
        init() {
            this.sendRequest();
        },
        showLoader() {
            if (this.isShowLoader) {
                showLoaders();
            }
        },
        hideLoader() {
            if (this.isShowLoader) {
                hideLoaders();
            }
        },
        sendRequest() {
            var self = this;
            $.ajax({
                type: "POST",
                url: this.url,
                data: this.param,
                dataType: "json",
                beforeSend: function (xhr) {
                    if (self.isShowLoader) {
                        showLoaders();
                    }
                    xhr.setRequestHeader("wx_version", "1.0");
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                },
                success: function (res) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                    if (res != null && res != "") {
                        if (self.callBack) {
                            if (Object.prototype.toString.call(self.callBack) === "[object Function]") {
                                var code = res.code;
                                if (code != 200) {
                                    errorLogs(res);
                                    return false;
                                }
                                else {
                                    self.callBack(res);
                                }
                            } else {
                                errorMsg("系统异常");
                                return false;
                            }
                        }
                    }
                },
                error: function (error) {
                    if (self.isShowLoader) {
                        hideLoaders();
                    }
                }
            });
        }
    }

    window.deleteRequest = deleteRequest;
    window.putRequest = putRequest;
    window.putJsonRequest = putJsonRequest;
    window.imageFileupload = imageFileupload;
    window.getRequest = getRequest;
    window.postRequest = postRequest;
    window.postJsonRequest = postJsonRequest;
    window.postLoginJsonRequest = postLoginJsonRequest;
    window.imageMitFileupload = imageMitFileupload;
    window.getNoResultRequest = getNoResultRequest;
    window.postNoResultRequest = postNoResultRequest;
})();



/**
 *  错误信息
 * */
function errorLogs(data) {
    if (data.code == 403 || data.code == 10101 || data.code == 10102) {
        errorSetTimeOut("请重新登录", "/pages/login.html");
        return false;
    } else if (data.code == 201) {
        errorMsg("参数不能为空");
        return false;
    } else if (data.code == 500) {
        errorMsg("系统异常");
        return false;
    } else if (data.code == 203) {
        errorMsg("对象不存在");
        return false;
    } else if (data.code == 202) {
        errorMsg("参数错误");
        return false;
    } else if (data.code == 300) {
        errorMsg("数据重复");
        return false;
    }
    else {
        errorMsg(data.message);
        return false;
    }
}