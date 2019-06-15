var app = getApp()

Page({
  data: {
    userInfo: null,
    btnLoading: false,
    btnDisabled: false,
    demoList: {
      header: '表单',
      items: [
        {
          content: {body: 'Map'},
          action: {name: 'navigate', url: '../demo/map'},
        },
        {
          content: {body: 'list'},
          action: {name: 'navigate', url: '../demo/list'},
        },
        {
          content: {body: 'Panel'},
          action: {name: 'navigate', url: '../demo/panel'},
        },
        {
          content: {body: 'Search Bar'},
          action: {name: 'navigate', url: '../demo/searchbar'},
        },
        {
          content: {body: 'Message'},
          action: {name: 'navigate', url: '../demo/message'},
        },
        {
          content: {body: 'input'},
          action: {name: 'navigate', url: '../demo/input'},
        },
        {
          content: {body: 'Uploader'},
          action: {name: 'navigate', url: '../demo/uploader'},
        },
        {
          content: {body: 'Preview'},
          action: {name: 'navigate', url: '../demo/preview'},
        },
      ],
    },
  },
  onLoad: function (option) {
    // option.query 含有 query 对象
  },
  onShow: function () {
    var page = this
    app.loadSession(function (session) {
    })
  },
  // 自定义事件处理函数，响应点击按钮
  go: function() {
    wx.navigateTo({
      url: '/pages/customer/view'
    })
  },
})
