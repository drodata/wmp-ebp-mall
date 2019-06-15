var app = getApp()

Page({
  data: {
    reaction: null, // '0' 表示同意, '1' 表示不同意，据此填充意见文本框基础内容
    message: null, // 存放表单创建后的 visit 对象，该值设置后，将转向显示页面
    needAudit: false, // 是否需要转交下一个审批人
    btnLoading: false,
    btnDisabled: false,

    fields: {
      note: {
        name: 'content',
        placeholder: '意见',
        style: 'height: 8em'
      },
    },
    attributes: {
      id: null, // notification id, 值在 query string 中
      auditor: null,
    },
    cells: {
      AuditSwitch: {
        label: '转交下一个审批人',
        checked: false,
        handler: 'switchAudit',
      },
      auditor: {
        action: { name: 'navigate', url: '../common/auditor'},
        content: { body: '审批人'},
      },
    },
  },
  onLoad: function (query) {
    this.setData({
      "attributes.id": query.id,
      "fields.note.value": query.reaction === '0' ? '同意。' : '不同意',
    })
  },
  onShow: function () {
    var page = this
    app.loadSession(function (session) {
    })
  },
  submitForm: function(event) {
    var page = this
    var data = event.detail.value
    data = Object.assign(data, page.data.attributes)
    if (data.content === '') {
      wx.showModal({title: '数据不合法', content: '审批内容不能为空'})
      return false
    }
    if (page.data.needAudit && (data.auditor == null)) {
      wx.showModal({title: '数据不合法', content: '审批人不能为空'})
      return false
    }
    this.setData({
      btnLoading: true,
      btnDisabled: true,
    })
    wx.request({
      url: app.config.baseUrl + 'notifications/audit?key=' + app.data.session.key,
      method: 'POST',
      data: data,
      success: function (resp) {
        if (resp.statusCode != 200) {
          app.handleError(resp)
        }
        // resp.data 值为 true, 没什么意义
        wx.navigateBack()
      },
      complete: function (res) {
        page.setData({ btnLoading: false, btnDisabled: false })
      }
    })
  },
  switchAudit: function (e) {
    var page = this
    page.setData({
      needAudit: e.detail.value,
    })
    if (!e.detail.value) {
      // 重置隐藏的下一个审批人
      page.setData({ "attributes.auditor": null })
    }
  },
})
