var app = getApp()

Page({
  data: {
    panelListView: {
      items: null,
      pagination: {},
      hasMore: false,
      reachBottom: false,
    },
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    //this.setData({ id: query.id })
  },
  onShow: function () {
    var page = this
    app.loadSession(function(session){
      if (page.data.panelListView.items === null) {
        wx.request({
          url: app.config.baseUrl + 'notifications?sort=-created_at&key=' + app.data.session.key,
          success: function (resp) {
            if (resp.statusCode != 200) {
              app.handleError(resp)
            }
            page.assemble(resp.data)
          },
        })
      }
    })
  },
  // 获取到从业务服务器返回的数据后组装成模板需要的格式，同时更新页面内相应的数据
  assemble: function (data) {
    var page = this
      , items = []

    // 没有满足条件的
      // model 表示 notification
      data.items.forEach(function (model) {
        var cells = []
        cells.push({
            type: 'text', 
            content: {
              title: '普通审批',
              desc: model.message.content,
            },
        })
        items.push({
          header: model.creator + ' ' + model.time,
          items: cells,
          actions: [
            {
              name: 'tap',
              bind: 'chooseReaction',
              dataset: {id: model.id},
              text: '审批',
              type: 'primary',
            },
          ],
        })
      })
    page.setData({
      panelListView: {
        items: page.data.panelListView.items === null ? items : page.data.panelListView.items.concat(items),
        pagination: data.meta,
        hasMore: data.meta.currentPage < data.meta.pageCount,
        reachBottom: false,
      }
    })
  },
  previewImage: function(e){
    app.previewImage(e.currentTarget.dataset.set.urls)
  },
  openLocation: function(e){
    app.openLocation({
      longitude: e.currentTarget.dataset.set.longitude,
      latitude: e.currentTarget.dataset.set.latitude,
    })
  },
  chooseReaction: function(e) {
    var page = this
      , items = ['同意', '不同意']
      , data = e.currentTarget.dataset.set
    wx.showActionSheet({
      itemList: items,
      success: function(resp) {
        if (!resp.cancel) {
          wx.navigateTo({ url: '/pages/notification/audit?id=' + data.id + '&reaction=' + resp.tapIndex })
        }
      },
    })
  },
})
