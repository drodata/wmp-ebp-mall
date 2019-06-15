var app = getApp()

Page({
  data: {
    auditorItems: [], 
    scenario: null, // 'audit' 表示普通审批
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    this.setData({ scenario: query.scenario })
  },
  onShow: function () {
    var page = this
    app.loadSession(function(session) {
      wx.request({
        url: app.config.baseUrl + 'departments?key=' + app.data.session.key,
        success: function (resp) {
          var users = resp.data.users
            , cells = []
          users.forEach(function (user, idx) {
            cells.push({
              action: {
                name: 'tap',
                bind: 'chooseAuditor',
                dataset: {id: user.id, display_name: user.display_name},
              },
              content: {
                header: user.avatar_url,
                body: user.display_name,
              },
            })
          })
          page.setData({
            auditorItems: cells,
          })
        }
      })
    })
  },
  chooseAuditor: function (e) {
    var page = this
      , data = e.currentTarget.dataset.set
      , formerPage = app.getFormerPage()
    switch (page.data.scenario) {
      default : // 普通审批
        formerPage.setData({
          "attributes.auditor": data.id,
          "cells.auditor.content.footer": data.display_name,
        })
        break
    }
    wx.navigateBack()
  },
})
