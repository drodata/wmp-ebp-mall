var app = getApp()

Page({
  data: {
    message: null, // 存放表单创建后的消息对象，用于显示表单提交后的提示信息
    needAudit: false, // 开关
    btnLoading: false,
    btnDisabled: false,
    fields: {
      note: { name: 'content', placeholder: '意见', style: 'height: 8em' },
    },
    attributes: {
      id: null,
      auditor: null,
      via: null,
    },
    cells: {
      AuditSwitch: {
        label: '下次自动登录',
        checked: false,
        handler: 'switchAudit',
      },
      via: {
        action: { name: 'tap', bind: 'chooseVia'},
        content: { body: '途径'},
      },
      auditor: {
        action: { name: 'navigate', url: '../common/auditor'},
        content: { body: '审批人'},
      },
    },
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    //this.setData({ id: query.id })
  },
  onShow: function () {
    var page = this
    // 加载会话
    app.loadSession(function(session){
    })
  },
  // switch
  switchAudit: function (e) {
    // e.detail.value: true or false
    this.setData({
      //needAudit: e.detail.value,
    })
    if (!e.detail.value) {
      //page.setData({ "attributes.auditor": null })
    }
  },
  // actionSheet
  chooseVia: function(e) {
    var page = this
      , items = ['浏览器', '小程序']
      , data = e.currentTarget.dataset.set // 自定义数据
    wx.showActionSheet({
      itemList: items,
      success: function(resp) {
        if (!resp.cancel) {
          page.setData({
            "attributes.via": resp.tapIndex,
            "cells.via.content.footer": items[resp.tapIndex],
          })
        }
      },
    })
  },
})
