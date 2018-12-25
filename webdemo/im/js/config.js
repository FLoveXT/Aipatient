(function() {
  // 配置
  var envir = 'online';
  var configMap = {
    dev: {
        appkey: '76971a083ff1075ed1084758ed142fca',
      url: 'https://apptest.netease.im',
      chatroomList: 'https://apptest.netease.im/api/chatroom/homeList',
      chatroomAddr: 'https://apptest.netease.im/api/chatroom/requestAddress'
    },
    test: {
        appkey: '76971a083ff1075ed1084758ed142fca',
      url: 'https://apptest.netease.im',
      chatroomList: 'https://apptest.netease.im/api/chatroom/homeList',
      chatroomAddr: 'https://apptest.netease.im/api/chatroom/requestAddress'
    },
    pre: {
        appkey: '76971a083ff1075ed1084758ed142fca',
      url: 'https://apptest.netease.im',
      chatroomList: 'https://apptest.netease.im/api/chatroom/homeList',
      chatroomAddr: 'https://apptest.netease.im/api/chatroom/requestAddress'
    },
    online: {
        appkey: '76971a083ff1075ed1084758ed142fca',
      url: 'https://app.netease.im',
      chatroomList: 'https://app.netease.im/api/chatroom/homeList',
      chatroomAddr: 'https://app.netease.im/api/chatroom/requestAddress'
    }
  };
  window.CONFIG = configMap[envir];
  // 是否开启订阅服务
  window.CONFIG.openSubscription = true;
  //   window.CONFIG.privateConf = window.privateConf;
})();
