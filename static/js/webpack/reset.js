;(function () {
    /*
    * 6.4=设计稿尺寸/100
    * css元素尺寸=设计稿元素尺寸/100;
    */
    var change = 'orientationchange' in window ? 'orientationchange' : 'resize';
    function calculate() {
        var deviceWidth = document.documentElement.clientWidth;
        var minWidth = 320;
        var uiWidth = 750// 设计图尺寸
        if (deviceWidth < minWidth) {
            deviceWidth = minWidth;
        } else if (deviceWidth > uiWidth) {
            deviceWidth = uiWidth;
        }
        document.documentElement.style.fontSize = deviceWidth / (uiWidth/100) + 'px';
    };
    window.addEventListener(change, calculate, false);
    calculate();
})();
