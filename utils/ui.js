/**
 * Frequently used UI component
 */

var ui = {
  showLoading: function (text = null) {
    wx.showLoading({
      title: text ? text : '加载中……'
    })
  },

  hideLoading: function() {
    wx.hideLoading()
  }
}

module.exports = ui
