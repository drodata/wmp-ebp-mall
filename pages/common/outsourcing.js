var app = getApp()

Page({
  data: {
    items: [], 
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    //this.setData({ scenario: query.scenario })
  },
  onShow: function () {
    var page = this
    app.loadSession(function(session) {
      wx.request({
        // 5 表示外购供应商
        url: app.config.baseUrl + 'companies?category=5&key=' + app.data.session.key,
        success: function (resp) {
          var list = resp.data.items
            , cells = []
          list.forEach(function (model, idx) {
            cells.push({
              action: {
                name: 'tap',
                bind: 'chooseSupplier',
                dataset: {id: model.id, full_name: model.full_name},
              },
              content: {
                body: model.full_name,
              },
            })
          })
          page.setData({
            items: cells,
          })
        }
      })
    })
  },
  chooseSupplier: function (e) {
    var page = this
      , data = e.currentTarget.dataset.set
      , formerPage = app.getFormerPage()
    formerPage.setData({
      "attributes.outsourcing_id": data.id,
      "cells.supplier.content.footer": data.full_name,
    })
    wx.navigateBack()
  },
})
