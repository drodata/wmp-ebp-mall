var app = getApp()
// pages/sku/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    sku: null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    this.setData({ 
      id: query.id,
      })
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
    var page = this
    app.loadSession(function(session) {
    wx.request({
      url: app.config.baseUrl + 'skus/' + page.data.id + '?access-token=' + app.data.session.value,
      success: function (response) {
        page.setData({sku: response.data})

        let items = []
        for (let i = 0; i < response.data.imageUrls.length; i++) {
          items[i] = {url: response.data.imageUrls[i]}
        }
        page.setData({swiperItems: items})
      }
    })
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})
