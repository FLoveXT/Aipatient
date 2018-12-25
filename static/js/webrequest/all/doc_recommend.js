var DoctorsList = []; //名医推荐列表
var DoctorsPageIndex = 1; //分页默认第一页
var DoctorsPageSize = 8; //医生加载分页页数
var DoctorsIsLoading = false; //是否还在继续加载
var is_stop=false;

/**
 * 获取医生推荐列表的数据
 */
function docrecommend() {
	var parments = {
			pageNum: DoctorsPageIndex,
			pageSize: DoctorsPageSize
	};
	new getRequest({
		url: "/api/doctor/list_recommend.json",
		isShowLoader: true,
		param: parments,
		callBack(res) {
			if (res.code == 200) {
				DoctorsList=DoctorsList.concat(res.data);
				DoctorsIsLoading=res.page.pageCount>DoctorsPageIndex?true:false;
				$(".doc-list").html(template("doc-recommend-div",{list:DoctorsList}));
				is_stop=true;
				if(DoctorsIsLoading==false)
				{
					$("#div_scroll").remove();
				}
				$("#div_scroll button").removeAttr("disabled");
				setTimeout(function(){
                    $(".doc-list .user").each(function(){
                         var src=$(this).attr("src");
                         if(!src){
                            $(this).lazyLoad();
                         }
                    });    
                });
			} else {
				errorMsg(res.message);
				return false;
			}
		}
	})
}

/**
 *  点击加载继续加载
 */
function scrollLoading(_this)
{
	$(_this).attr("disabled",true);
	DoctorsPageIndex=DoctorsPageIndex+1;
	this.docrecommend();	
}

window.onload=function(){
	 docrecommend();
}


function imageClick(_id) {
    var url = "/pages/home/doc_page.html?doctorId=" + _id;
    loadSetTimeOut("请稍等",url);
}

