var app = getApp()

Page({
  data: {
    userInfo: null,
    btnLoading: false,
    btnDisabled: false,
    preview: {
      header: {label: '姓名', value: 'go'},
      items: [
        {label: '姓名', value: 'go'},
        {label: '地址', value: 'go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:'},
      ],
      actions: [
        {
          name: 'tap',
          bind: 'go',
          dataset: {id: 3, name: 'go'},
          text: 'Go',
        },
        {
          name: 'navigate',
          url: '/pages/index/index',
          method: 'switchTab',
          text: '确认',
          type: 'primary',
        },
      ],
    },
    lite: {
      items: [
        {label: '姓名', value: 'go'},
        {label: '地址', value: 'go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:go:'},
      ],
    },
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
  go: function(e) {
    wx.showToast({title: 'haha'})
  },
})
