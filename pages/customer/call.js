var app = getApp()

Page({
  data: {
    userInfo: null,
    btnLoading: false,
    btnDisabled: false,
    customer_id: null,
  },
  onLoad: function (query) {
    this.setData({ customer_id: query.customer_id })
  },
  onShow: function () {
    var page = this
    app.loadSession(function (session) {
      page.setData({ session: session })
    })

  },
  submitForm: function(event) {
    var page = this
    this.setData({
      btnLoading: true,
      btnDisabled: true,
    })
    
    // assemble request params
    var formData = event.detail.value
    formData.session = this.data.session.key
    formData.customer_id = page.data.customer_id
    
    wx.request({
      url: app.config.baseUrl + 'customer/visit',
      method: 'POST',
      data: formData,
      success: function (res) {
        var data = res.data
        console.log(data)
        //wx.showToast({ title: res.data.message })
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
