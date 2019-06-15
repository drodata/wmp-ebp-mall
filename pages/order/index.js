var app = getApp()

Page({
  data: {
    orders: [],
    btnLoading: false,
    btnDisabled: false,
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    //this.setData({ id: query.id })
  },
  onShow: function () {
    // 加载会话
    app.loadSession()
    var page = this

    if (page.data.orders.length == 0) {
      wx.request({
        url: app.config.baseUrl + 'orders?status=3&sort=-fetch_time&key=' + app.data.session.key,
        success: function (resp) {
          if (resp.statusCode == 200) {
            page.assemble(resp.data, page)
          } else {
            app.handleError(resp)
          }
        },
      })
    }
  },
  // 获取到从业务服务器返回的数据后组装成模板需要的格式，同时更新页面内相应的数据
  assemble: function (data, page) {
    var items = []
    data.items.forEach(function (order, idx) {
      items[idx] = {
        header: {label: '', value: order.id},
        items: [
          {label: '客户', value: order.customer.full_name},
          {label: '净重', value: order.weight},
        ],
        actions: [
          {
            name: 'tap',
            text: '查看地址',
            bind: 'viewAddress',
            dataset: {address: order.address},
          },
          {
            name: 'tap',
            text: '发货',
            bind: 'pickup',
            type: 'primary',
            // 注意这里的属性在 pickup 事件中使用，谨慎修改属性
            dataset: {
              id: order.id,
              idx: idx
            },
          },
        ],
      }
    })
    page.setData({
      'orders': page.data.orders.concat(items),
    })
  },
  // 自定义事件处理函数，响应点击按钮
  viewAddress: function(e) {
    var addr = e.target.dataset.set.address
    wx.showModal({
      content: addr,
      cancelText: '关闭',
      confirmText: '复制地址',
      success: function (resp) {
        if (resp.confirm) {
          wx.setClipboardData({
            data: addr,
            success: function (resp) {
              wx.showToast({title: '已复制'})
            }
          })
        }
      }
    })
  },
  // 跳转至发货页面
  pickup: function(e) {
    var data = e.currentTarget.dataset.set
    wx.navigateTo({
      url: './pickup?id=' + data.id + '&idx=' + data.idx,
    })
  },
})
