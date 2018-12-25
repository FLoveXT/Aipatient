var detail = {
    recordId: '',
    appeal: '',
    symptom: '',
    tongueImages: [],
    otherImages: [],
    sex: '',
    template: '',
    template_info: 1, //默认1 成人模板 2:儿童模板
    template_sex: 1, // 默认为成人男 2 为成人女
    diet: {
        water: '[空]',
        waterDegree: '[空]',
        texture: [],
        appetite: '[空]',
        other: '[空]',
        supplement: '[空]'
    },
    excrement: {
        stool: '[空]',
        shape: [],
        colour: '[空]',
        other: [],
        urine: [],
        supplement: '[空]',
    },
    sleepMood: {
        fallAsleep: '[空]',
        quality: '[空]',
        wakeUp: [],
        dream: '[空]',
        other: [],
        supplement: '[空]'
    },
    body: {
        feel: [],
        handAndFoot: '[空]',
        sweat: [],
        headPharynx: [],
        cough: [],
        chest: [],
        body: [],
        livingHabit: [],
        supplement: '[空]'
    },
    gynaecology: {
        specialStage: '[空]',
        fertility: '[空]',
        abortion: '[空]',
        menopause: '[空]',
        cycle: '[空]',
        period: '[空]',
        color: '[空]',
        quantity: '[空]',
        clot: '[空]',
        dysmenorrhoea: [],
        feel: '[空]',
        leucorrheaCapacity: '[空]',
        leucorrhea: '[空]',
        supplement: '[空]',
    },
    andrology: {
        sexualFunction: '[空]',
        andrology: '[空]',
        supplement: "[空]"
    },
    special: {
        temperature: '[空]',
        foot: '[空]',
        cough: '[空]',
        sputum: [],
        supplement: '[空]',
    },
    basicSituation: {
        diet: '[空]',
        drink: '[空]',
        spirit: '[空]',
        sleep: '[空]',
        sweat: '[空]',
        supplement: '[空]',
    },
    childExcrement: {
        stoolTime: '[空]',
        shape: [],
        colour: '[空]',
        urineTime: '[空]',
        urineColour: '[空]',
        supplement: '[空]',
    },
    patientId: '',
    patient: {
        id: '',
        name: '',
        sex: '',
        height: '',
        weight: '',
        phoneNumber: "",
        address: '',
        medicalHistory: '',
        remarks: ''
    }
};

$(function () {

    $(".footer-info").remove();
    Init();
})

function Init() {
    var recordId = getQueryString("recordId");
    if (recordId == null || recordId == "" || recordId == undefined) {
        errorSetTimeOut("请求参数错误", "/");
        return false;
    }
    detail.recordId = recordId;
    getDetail();
}


function getDetail() {
    var api = "/api/interrogation/" + detail.recordId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                if (data == undefined) {
                    errorMsg("暂无消息");
                    return false;
                }
                detail.appeal = data.appeal;
                detail.symptom = data.symptom;
                detail.tongueImages = data.tongueImages;
                detail.otherImages = data.otherImages;
                detail.sleepMood = data.sleepMood;
                detail.andrology = data.andrology;
                detail.body = data.body;
                detail.diet = data.diet;
                detail.excrement = data.excrement;
                detail.gynaecology = data.gynaecology;
                detail.special = data.special;
                detail.basicSituation = data.basicSituation;
                detail.childExcrement = data.childExcrement;
                detail.patientId = data.patientId;
                detail.template = data.template;
                detail.sex = data.sex;
                detail.template_info = data.template == "儿童" ? 2 : 1; //默认1 成人模板 2:儿童模板
                detail.template_sex = data.sex == "M" ? "男" : "女"; // 默认为成人男 2 为成人女
                getdetailReinfo();
                setTimeout(function () {
                    zoomInfo();
                },500);
                

            } else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}



function getdetailReinfo() {
    var api = '/api/patient/' + detail.patientId;
    new getRequest({
        url: api,
        isShowLoader: true,
        callBack(res) {
            if (res.code == 200) {
                var data = res.data;
                detail.patient = data;
                $(".detail-list").html(template('detail-div', { list: detail }))
            } else {
                errorMsg(res.message);
                return false;
            }
        }
    })
}