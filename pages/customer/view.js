var app = getApp()

Page({
  data: {
    userInfo: null,
    btnLoading: false,
    btnDisabled: false,
    id: null,
    customer: null,
  },
  onLoad: function (query) {
    // 设置客户 id, onShow 内会用到
    this.setData({id: query.id})
  },
  onShow: function () {
    var page = this
    app.loadSession()

    wx.request({
      url: app.config.baseUrl + 'customers/' + page.data.id + '?key=' + app.data.session.key,
      success: function (response) {
        var customer = response.data
        var list = {
          header: '基本信息',
          items: [
            {
              content: { body: 'ID', footer: customer.id },
            },
            {
              content: { body: '全称', footer: customer.full_name },
              //action: { name: 'tap', bind: 'go'},
            },
            {
              content: { body: '余额', footer: customer.balance },
            },
          ],
        }
        page.setData({customer: list})
      }
    })
  },
  // 自定义事件处理函数，响应点击按钮
  chooseInteraction: function() {
    var page = this
    wx.showActionSheet({
      itemList: ['登门拜访', '电话拜访'],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/customer/visit?id=' + page.data.id
          })
        } else if (res.tapIndex == 1) {
          wx.navigateTo({url: '/pages/customer/index'})
        }
      },
      fail: function(res) {
      }
    })
  },
})
