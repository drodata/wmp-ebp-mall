var app = getApp()

Page({
  data: {
    items: [], 
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    this.setData({
      scenario: query.scenario,
      company_id: query.company_id,
    })
  },
  onShow: function () {
    var page = this
    app.loadSession(function(session) {
      wx.request({
        url: app.config.baseUrl + 'addresses?company_id=' + page.data.company_id + '&key=' + app.data.session.key,
        success: function (resp) {
          var list = resp.data.items
            , cells = []
          list.forEach(function (model, idx) {
            cells.push({
              action: {
                name: 'tap',
                bind: 'chooseAddress',
                dataset: {id: model.id, contacter: model.contacter, address: model.address},
              },
              content: {
                body: model.address,
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
  chooseAddress: function (e) {
    var page = this
      , data = e.currentTarget.dataset.set
      , formerPage = app.getFormerPage()
    formerPage.setData({
      "attributes.address_id": data.id,
      "cells.address.content.footer": data.contacter,
    })
    wx.navigateBack()
  },
})
