var app = getApp()
// site.js
Page({

  /**
   * Page initial data
   */
  data: {
    btnLoading: false,
    btnDisabled: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    app.loadSession()
  },
  submitForm: function(event) {
    var page = this
    var data = event.detail.value
    console.log(data)
    if (data.name === null) {
      wx.showModal({title: '数据不合法', content: '审批内容不能为空'})
      return false
    }
    this.setData({
      btnLoading: true,
      btnDisabled: true,
    })
    wx.request({
      url: app.config.baseUrl + 'brands?access-token=333',
      method: 'POST',
      data: data,
      success: function (resp) {
        console.log(resp)
        if (resp.statusCode != 200) {
          app.handleError(resp)
        }
        // resp.data 含有 message 对象
        //page.setData({ message: resp.data })
      },
      complete: function (res) {
        page.setData({ btnLoading: false, btnDisabled: false })
      }
    })
  },
})
