var app = getApp()
Page({

  data: {
    btnLoading: false,
    btnDisabled: false,
    userInfo: null,
  },

  onLoad: function (options) {
  },

  onShow: function () {
    var page = this
    app.loadSession(function(session){
      page.setData({
        userInfo: app.data.userInfo,
      })
    })
  },

  // form
  formSubmit: function(e) {
    this.setData({
      btnLoading: true,
      btnDisabled: true,
    })
    
    // assemble request params
    var postData = e.detail.value
    var page = this
    postData.session = app.data.session.key
    postData.avatarUrl = page.data.userInfo.avatarUrl
    
    wx.request({
      url: app.config.baseUrl + 'site/bind-account',
      method: 'POST',
      data: postData, 
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showModal({
            title: res.data.message,
            content: res.data.message
          })
        }
        if (res.data.status) {
          var user = res.data.user
          var newSession = wx.getStorageSync('session')
          newSession.isBind = true
          newSession.user = user
          wx.setStorageSync('session', newSession)

          page.setData({
            session: newSession
          })

          wx.showToast({
            title: res.data.msg,
            icon: 'success'
          })
          wx.switchTab({
            url: '../index/index'
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      },
      complete: function (res) {
        page.setData({
          btnLoading: false,
          btnDisabled: false,
        })
      }
    })
  },
})
