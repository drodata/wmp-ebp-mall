var app = getApp()

Page({
  data: {
    userInfo: null,
    btnLoading: false,
    btnDisabled: false,
    inputShowed: false,
    inputVal: '',
    list: [
      {
        content: { body: '客户' },
        action: { name: 'navigate', url: '/pages/customer/index'},
      },
      {
        content: { body: '客户' },
        action: { name: 'navigate', url: '/pages/customer/index'},
      },
      {
        content: { body: '客户' },
        action: { name: 'navigate', url: '/pages/customer/index'},
      },
      {
        content: { body: '客户' },
        action: { name: 'navigate', url: '/pages/customer/index'},
      },
    ],
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    //this.setData({ id: query.id })
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
  showInput: function () {
    this.setData({inputShowed: true });
  },
  hideInput: function () {
    this.setData({inputShowed: false, inptuVal: ''});
  },
  clearInput: function () {
    this.setData({inputVal: ''});
  },
  inputTyping: function (e) {
    var keyword = e.detail.value
    this.setData({ inputVal: keyword });
  }
})
