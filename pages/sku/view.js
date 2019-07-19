var app = getApp()
// pages/sku/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    id:6, // sku id
    sku: null,
    imgUrl: 'http://file.yalongdiamond.com/media/1b/2632/2ade59535dc0deace28e597aee.jpg',
    imgUrls: [
      "http://static.ebp.com/0e/3dc3/d54990997c1c1008acd469a05a_l.jpg",
      'http://i.yalong.com/assets/iphone.jpg',
      'http://i.yalong.com/assets/iphone2.jpg',
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=840',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=840',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=840'
      /*
      'http://file.yalongdiamond.com/media/1b/2632/2ade59535dc0deace28e597aee.jpg',
      'http://file.yalongdiamond.com/media/1b/2632/2ade59535dc0deace28e597aee.jpg',
      'http://file.yalongdiamond.com/media/1b/2632/2ade59535dc0deace28e597aee.jpg'
      */
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
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
    var page = this
    app.loadSession(function(session) {
    wx.request({
      url: app.config.baseUrl + 'skus/' + page.data.id + '?access-token=' + app.data.session.value,
      success: function (response) {
        page.setData({sku: response.data})
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
