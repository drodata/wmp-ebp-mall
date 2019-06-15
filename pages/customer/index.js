var app = getApp()

Page({
  data: {
    btnLoading: false,
    btnDisabled: false,
    customers: [],
    topList: {
      items: [
        {
          type: 'smallAppmsg',
          action: {name: 'navigate', url: '/pages/customer/create'},
          content: {body: '新建'},
        },
        {
          type: 'smallAppmsg',
          action: {name: 'navigate', url: '/pages/customer/search'},
          content: {body: '搜索'},
        },
      ],
    },

    pagination: {},
    hasMore: false,
    reachBottom: false,
  },
  onLoad: function (option) {
  },
  onShow: function () {
    var page = this
    app.loadSession()

    if (page.data.customers.length == 0) {
      wx.request({
        url: app.config.baseUrl + 'customers?key=' + app.data.session.key,
        success: function (resp) {
          page.assemble(resp.data, page)
        },
      })
    }
  },
  onReachBottom: function () {
    var page = this
    page.setData({ reachBottom: true, })

    if (page.data.hasMore) {
      var counter = page.data.pagination.currentPage + 1

      wx.request({
        url: app.config.baseUrl + 'customers?key=' + app.data.session.key + '&page=' + counter,
        success: function (resp) {
          page.assemble(resp.data, page)
        }
      })
    }
  },
  // 获取到从业务服务器返回的数据后组装成模板需要的格式，同时更新页面内相应的数据
  assemble: function (data, page) {
    var items = []
    data.items.forEach(function (customer, idx) {
      items.push({
        type: 'appmsg',
        action: {name: 'navigate', url: 'view?id=' + customer.id},
        content: {
          title: customer.full_name,
          desc: customer.short_name,
        },
      })
    })
    page.setData({
      'customers': page.data.customers.concat(items),
      pagination: data.meta,
      hasMore: data.meta.currentPage < data.meta.pageCount,
      reachBottom: false,
    })
  }
})
