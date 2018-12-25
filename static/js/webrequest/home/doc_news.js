var doc_news = {
    title: '',//seo标题名,xx的动态
    list: [],
    pageIndex: 1,
    pageSize: 10,
    disabled: false,
    id: '',
};

function Init() {
    var id = getQueryString("id");
    if (id == null || id == undefined || id == "") {
        errorSetTimeOut("错误,请求参数错误", "/");
        return false;
    }
    doc_news.id = id;
    doc_news.list = [];
    doc_news.pageIndex = 1;
    doc_news.pageSize = 10;
    doc_news.disabled = false;
    getList();
}

function getList() {
    var parmets = {
        pageNum: doc_news.pageIndex,
        pageSize: doc_news.pageSize
    };
    new getRequest({
        url: "/api/doctor/list_news/" + doc_news.id,
        isShowLoader: true,
        param: parmets,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                doc_news.list = doc_news.list.concat(data);
                doc_news.disabled = res.page.pageCount > doc_news.pageIndex ? true : false;
                $(".list_news").html(template('list-div', { list: doc_news.list }));
            }
            else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}

$(function () {
    Init();

    $(window).scroll(function () {
        if ($(document).scrollTop() + $(window).height() >= $(document).height() - 50) {
            if (!doc_news.disabled) {
                return false;
            }
            doc_news.pageIndex = doc_news.pageIndex + 1;
            getList();
            console.log("new:" + doc_news.pageIndex);
        }
    });
})

function navUrlArticleDetail(_this, _id) {
    var urlId = _id
    console.log(urlId);
    if (!urlId) {
        return false;
    }
    var url = '/pages/home/news_detail.html?id=' + urlId;
    loadSetTimeOut("请稍后", url);
    return false;
}