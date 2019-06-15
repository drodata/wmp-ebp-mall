var app = getApp()

Page({
  data: {
    userInfo: null,
    btnLoading: false,
    btnDisabled: false,
    message: {
      title: 'Done',
      buttons: [
        {
          url: '/pages/index/index',
          text: '返回首页',
          type: 'primary',
          method: 'switchTab',
        },
        {
          url: '/pages/customer/index',
          text: '放弃',
        },
      ],
    },
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    //this.setData({ id: query.id })
  },
  onShow: function () {
    var page = this
    app.loadSession()
  },
  // 自定义事件处理函数，响应点击按钮
  go: function() {
    wx.navigateTo({
      url: '/pages/customer/view'
    })
  },
})
