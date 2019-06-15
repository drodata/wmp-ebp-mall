var app = getApp()

Page({
  data: {
    scenario: 'default', // 标记使用场景，据此判断选完客户后的动作。默认是转向客户详情页面
    btnLoading: false,
    btnDisabled: false,
    inputShowed: true,
    inputVal: '',
    resultItems: [],
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    if (query.scenario) {
      this.setData({ scenario: query.scenario })
    }
  },
  onShow: function () {
    var page = this
    app.loadSession(function (session) {
    })
  },
  showInput: function () {
    this.setData({inputShowed: true });
  },
  hideInput: function () {
    this.setData({inputShowed: false, inptuVal: ''});
  },
  clearInput: function () {
    this.setData({inputVal: ''});
  },
  // 用户输入关键词，根据关键词实时获取信息
  inputTyping: function (e) {
    var page = this
    var keyword = e.detail.value
    //return false
    this.setData({ inputVal: keyword });

    wx.request({
      url: app.config.baseUrl + 'customers/search?keyword=' + keyword + '&key=' + app.data.session.key,
      success: function (response) {
        var customers = response.data.items
        var result = [];
        customers.forEach(function (customer, index) {
          if (page.data.scenario == 'default') {
            result.push({
              content: { body: customer.full_name },
              action: { name: 'navigate', url: '/pages/customer/view?id=' + customer.id + '&key=' + app.data.session.key},
            })
          } else {
            // 新建订单、外勤签到等操作相同
            result.push({
              content: { body: customer.full_name },
              action: { name: 'tap', bind: 'check', dataset: customer},
            })
          }
        })
        page.setData({resultItems: result})
      }
    })
  },
  check: function(e) {
    var page = this
      , customer = e.currentTarget.dataset.set
      , scenario = page.data.scenario
      , formerPage = app.getFormerPage()
    formerPage.setData({
      customer: customer,
      "attributes.customer_id": customer.id,
      "cells.address.action.url": '../common/address?scenario=order&company_id=' + customer.id,
      "cells.customer.content.footer": customer.full_name,
    })

    if (scenario == 'order') {
      formerPage.setData({
        isForeignCurrency: customer.currency != '1',
        "attributes.currency": customer.currency, // 订单的货币属性从客户的货币属性中获得
        "cells.currency.content.footer": customer.readableCurrency,
        "attributes.payment_way": customer.payment_way, // 订单的结算方式属性从客户的结算属性中获得
        "cells.payment_way.content.footer": customer.readablePaymentWay,
      })
    }
    wx.navigateBack()
  },
})
