var app = getApp()

Page({
  data: {
    message: null, // 存放表单创建后的 visit 对象，该值设置后，将转向显示页面
    btnLoading: false,
    btnDisabled: false,
    validateCarbon: false,
    customerPreference: null,

    attributes: {
      auditor: null,
      carbon: null,
    },
    fields: {
      note: {
        name: 'content',
        placeholder: '内容',
        style: 'height: 8em'
      },
    },
    cells: {
      auditor: {
        action: { name: 'navigate', url: '../common/auditor?scenario=audit'},
        content: { body: '审批人'},
      },
      carbon: {
        action: { name: 'navigate', url: '../common/carbon?scenario=audit'},
        content: { body: '抄送范围'},
      },
    },
  },
  onLoad: function (query) {
    this.setData({ customer_id: query.customer_id })
  },
  onShow: function () {
    var page = this
    app.loadSession(function(session){})
  },
  submitForm: function(event) {
    var page = this
    var data = event.detail.value
    data = Object.assign(data, page.data.attributes)
    if (data.content === '') {
      wx.showModal({title: '数据不合法', content: '审批内容不能为空'})
      return false
    }
    if (!data.auditor) {
      wx.showModal({title: '数据不合法', content: '审批人不能为空'})
      return false
    }
    if (!page.data.validateCarbon) {
      wx.showModal({title: '数据不合法', content: '发送范围不能为空'})
      return false
    }
    this.setData({
      btnLoading: true,
      btnDisabled: true,
    })
    wx.request({
      url: app.config.baseUrl + 'audits?key=' + app.data.session.key,
      method: 'POST',
      data: data,
      success: function (resp) {
        if (resp.statusCode != 200) {
          app.handleError(resp)
        }
        // resp.data 含有 message 对象
        page.setData({ message: resp.data })
      },
      complete: function (res) {
        page.setData({ btnLoading: false, btnDisabled: false })
      }
    })
  },
})
