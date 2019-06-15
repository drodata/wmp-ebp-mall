var app = getApp()

Page({
  data: {
    userInfo: null,
    btnLoading: false,
    btnDisabled: false,
    userList: null,
  },
  onLoad: function (option) {
    // option.query 含有 query 对象
  },
  onShow: function () {
    var page = this
    app.loadSession(function (session) {
      var user = app.data.userInfo
      var list = {
        header: '基本信息',
        items: [
          {
            content: {header: user.avatarUrl, body: '昵称', footer: user.nickName},
          },
          {
            content: {body: '绑定订单系统账号', footer: app.data.session.user.username},
          },
        ],
      }
      page.setData({
        userInfo: app.data.userInfo,
        session: app.data.session,
        userList: list
      })
    })
  },
  // 解绑账号
  revoke: function (e) {
    var page = this
    page.setData({ btnLoading: true, btnDisabled: true })
    
    wx.request({
      url: app.config.baseUrl + 'site/unbind?key=' + app.data.session.key,
      method: 'POST',
      success: function (res) {
        var newSession = wx.getStorageSync('session')
        newSession.isBind = false
        newSession.user = null
        wx.setStorageSync('session', newSession)

        wx.showToast({
          title: res.data.message,
          icon: 'success'
        })
        wx.redirectTo({
          url: '../index/bind'
        })
      }
    })
  },
})
