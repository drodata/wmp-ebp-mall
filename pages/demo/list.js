var app = getApp()

Page({
  data: {
    userInfo: null,
    btnLoading: false,
    btnDisabled: false,
    list: {
      header: 'List',
      items: [
        {
          content: { body: '客户', badge: 'new'  },
          action: { name: 'navigate', url: '/pages/customer/index'},
        },
        {
          action: {
            name: 'tap',
            bind: 'chooseSex',
          },
          content: { body: '性别', footer: '男' },
        },
        {
          content: { body: '文本', footer: 'haha'},
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
      page.setData({
      })
    })
  },
  // 自定义事件处理函数，响应点击按钮
  chooseSex: function() {
    wx.showActionSheet({
      itemList: ['男', '女', '不愿透漏'],
      success: function(res) {
        console.log(res.tapIndex)
      },
      fail: function(res) {
      }
    })
  },
})
