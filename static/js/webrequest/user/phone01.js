function NextTo(){
    if($(".input input").val()==""){
        errorMsg("请输入密码");
        return false;
    }
    var params={
        passWord:$(".input input").val()
    }
    new postJsonRequest({
        url:"/api/user/reset_phone_number_one_step.json",
        isShowLoader:true,
        param:JSON.stringify(params),
        callBack(res){
            if(res.code==200){
                window.location.href="/pages/users/phone02.html?code="+res.data.lastStepCode
            }
        }
    })
}